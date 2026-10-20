"""
Multimodal Attendance & Engagement Agent
Milestone 6: Interface, Testing, and Deployment
Activity 6.3: Validate outputs and edge cases (test_edge_cases.py)

Comprehensive unit and edge-case tests validating:
- Empty frames and tracker stability
- Sustained presence thresholds (<5s pending, >=5s present, >10s absent)
- Audio silence and high-noise fallback handling
- Multimodal signal fusion score boundaries [0.0, 1.0]
- AI teaching suggestion generation across engagement profiles
- End-to-end simulation runner and artifact output generation
"""

import os
import pytest
import numpy as np
from pathlib import Path

from app.vision_module import FaceTracker, AttendanceEngine, PRESENCE_THRESHOLD_SECONDS, ABSENCE_TIMEOUT_SECONDS
from app.audio_module import AudioModule, VADEngine
from app.multimodal_agent import MultimodalAgent, EngagementSignal, SessionEngagementRecord
from app.main_runner import AttendAICoreRunner


# ─── Vision Module Edge Cases ───────────────────────────────────────────────

def test_facetracker_empty_frame():
    """Tracker should handle empty detection lists without crashing."""
    tracker = FaceTracker()
    tracks = tracker.update([], timestamp=1.0)
    assert tracks == {}
    assert tracker.next_id == 1


def test_sustained_presence_thresholds():
    """Validates that presence < 5s is pending, and >= 5s is marked present."""
    engine = AttendanceEngine(presence_threshold=5.0, absence_timeout=10.0)

    # Track 1 appears at t=1.0 (first seen)
    mock_tracks_1 = {
        1: {"bbox": (10, 10, 50, 50), "first_seen": 1.0, "last_seen": 3.0, "name": "Student-01"}
    }
    engine.process(mock_tracks_1)
    status_1 = engine.attendance_records[1]["status"]
    assert status_1 == "pending", f"Expected pending after 2s presence, got {status_1}"

    # Track 1 sustains until t=6.5 (> 5s duration)
    mock_tracks_2 = {
        1: {"bbox": (12, 12, 50, 50), "first_seen": 1.0, "last_seen": 6.5, "name": "Student-01"}
    }
    engine.process(mock_tracks_2)
    status_2 = engine.attendance_records[1]["status"]
    assert status_2 == "present", f"Expected present after 5.5s presence, got {status_2}"
    assert engine.attendance_records[1]["marked_at"] is not None


def test_absence_timeout_marking():
    """Validates that absent timeout (> 10s elapsed) marks absent if unconfirmed."""
    engine = AttendanceEngine(presence_threshold=5.0, absence_timeout=10.0)

    mock_tracks = {
        2: {"bbox": (20, 20, 40, 40), "first_seen": 1.0, "last_seen": 2.0, "name": "Student-02"}
    }
    engine.process(mock_tracks)
    assert engine.attendance_records[2]["status"] == "pending"

    # Advance time without seeing student 2 again
    engine.check_absences(current_time=15.0)
    assert engine.attendance_records[2]["status"] == "absent"


# ─── Audio Module Edge Cases ────────────────────────────────────────────────

def test_audio_silence_handling():
    """Validates that pure silence does not crash RMS computation or VAD."""
    audio = AudioModule(source="mock")
    silent_pcm = b"\x00" * 960  # 480 samples of 16-bit PCM

    rms = audio._compute_rms(silent_pcm)
    assert rms == 0.0
    assert audio._classify_noise(rms) == "low"
    assert audio.vad.is_speech(silent_pcm) is False


def test_vad_high_energy_fallback():
    """High energy synthetic noise should register speech/activity under energy fallback."""
    vad = VADEngine()
    # High amplitude 16-bit sound
    loud_pcm = (np.ones(480, dtype=np.int16) * 15000).tobytes()
    is_speech = vad.is_speech(loud_pcm)
    assert is_speech is True


# ─── Multimodal Agent & Signal Fusion Edge Cases ────────────────────────────

def test_multimodal_signal_score_bounds():
    """Fusion score must always stay strictly within [0.0, 1.0]."""
    # Max possible signals
    sig_max = EngagementSignal(
        timestamp=10.0,
        student_id=1,
        name="Max",
        presence_duration=500.0,
        movement_score=2.0,
        speech_ratio=1.5,
        inactivity_duration=0.0
    )
    score_max = sig_max.compute_score()
    assert 0.0 <= score_max <= 1.0

    # Min possible signals (inactivity penalty maxed out)
    sig_min = EngagementSignal(
        timestamp=10.0,
        student_id=2,
        name="Min",
        presence_duration=0.0,
        movement_score=0.0,
        speech_ratio=0.0,
        inactivity_duration=120.0
    )
    score_min = sig_min.compute_score()
    assert score_min == 0.0


def test_teaching_suggestions_generation():
    """Validates generation of teaching suggestions based on engagement drops."""
    agent = MultimodalAgent()

    # Ingest 10 low-engagement intervals for 3 students
    for t in range(10):
        for sid in [1, 2, 3]:
            agent.ingest(
                student_id=sid,
                name=f"Student-{sid}",
                timestamp=float(t),
                presence_duration=float(t),
                movement_score=0.1,
                speech_ratio=0.05,
                inactivity_duration=25.0,
                attendance_status="present"
            )

    suggestions = agent.generate_teaching_suggestions()
    assert len(suggestions) > 0
    # Class avg is low, so pacing adjustment should be suggested
    pacing_suggestions = [s for s in suggestions if s["type"] == "pacing_adjustment"]
    assert len(pacing_suggestions) > 0


# ─── Core Runner End-to-End Simulation Edge Case ────────────────────────────

def test_core_runner_artifact_generation(tmp_path):
    """End-to-end integration test verifying file generation and session structure."""
    out_dir = tmp_path / "test_reports"
    runner = AttendAICoreRunner(
        video_source=0,
        audio_source="mock",
        output_dir=str(out_dir),
        mock_mode=True
    )
    res = runner.run_simulation_session(duration_seconds=5, num_students=3)

    assert "session_id" in res
    assert Path(res["json_path"]).exists()
    assert Path(res["csv_path"]).exists()
    assert res["summary"]["total_students_tracked"] == 3
    assert len(res["summary"]["student_analytics"]) == 3
