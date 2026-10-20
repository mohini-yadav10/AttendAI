"""
Multimodal Attendance & Engagement Agent
Milestone 6: Interface, Testing, and Deployment
Activity 6.1: Run core application (main_runner.py)

Orchestrates Vision Module, Audio Module, and Multimodal Agent into
a unified, privacy-preserving classroom intelligence pipeline.
Outputs timestamped attendance logs, engagement trends, teaching suggestions,
and per-student session analytics to console and local JSON/CSV logs.
"""

import os
import sys
import time
import json
import csv
import argparse
import logging
from datetime import datetime
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Ensure parent directory is in Python path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.vision_module import VisionModule, AttendanceEngine
from app.audio_module import AudioModule
from app.multimodal_agent import MultimodalAgent

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger("AttendAI-Core")


class AttendAICoreRunner:
    """
    Activity 6.1 — Core pipeline orchestrator for AttendAI.
    Combines Vision, Audio, and Multimodal Reasoning agents.
    Runs entirely offline and stores privacy-preserving logs locally.
    """

    def __init__(
        self,
        video_source=0,
        audio_source="mock",
        output_dir="reports",
        mock_mode=False
    ):
        self.video_source = video_source
        self.audio_source = audio_source
        self.output_dir = Path(output_dir)
        self.mock_mode = mock_mode
        self.output_dir.mkdir(parents=True, exist_ok=True)

        self.vision = VisionModule(source=video_source)
        self.audio = AudioModule(source=audio_source)
        self.agent = MultimodalAgent()

    def run_simulation_session(self, duration_seconds: int = 20, num_students: int = 5):
        """
        Runs a complete synthetic session simulation.
        Safe for headless/CI/CD, classroom testbeds, and mentor evaluation.
        """
        logger.info(f"🚀 Starting AttendAI Simulation Session ({duration_seconds}s, {num_students} students)...")
        session_id = f"sess_{datetime.now().strftime('%Y%m%d_%H%M%S')}"

        students = [
            {"id": 101 + i, "name": name}
            for i, name in enumerate([
                "Mohini Yadav", "Aarav Sharma", "Priya Patel",
                "Rahul Verma", "Sneha Reddy"
            ][:num_students])
        ]

        # Step-by-step session clock (1 sec per step)
        for t in range(1, duration_seconds + 1):
            # 1. Audio frame analysis (Noise & Speech Activity)
            audio_frame = self.audio.process_frame(timestamp=float(t))

            # 2. Vision & attendance updates for each student
            for idx, stu in enumerate(students):
                # Simulate realistic student behaviors
                if idx == 0:  # Highly engaged student
                    presence = float(t)
                    movement = 0.75 + (0.1 if t % 4 == 0 else -0.05)
                    inactivity = 0.0
                elif idx == 1:  # Normal engaged student
                    presence = float(t)
                    movement = 0.55
                    inactivity = 5.0 if t > 10 else 1.0
                elif idx == 2:  # Late arrival (arrives at t=8s)
                    presence = max(0.0, float(t - 8))
                    movement = 0.60 if t >= 8 else 0.0
                    inactivity = 0.0 if t >= 8 else float(t)
                elif idx == 3:  # Disengaged student
                    presence = float(t)
                    movement = 0.20
                    inactivity = 40.0 if t > 12 else 10.0
                else:  # Left early
                    presence = float(min(t, 6))
                    movement = 0.10 if t > 6 else 0.50
                    inactivity = float(t - 6) if t > 6 else 0.0

                # Determine attendance status by sustained presence threshold (5s)
                status = "present" if presence >= 5.0 else ("absent" if (t > 12 and presence < 5.0) else "pending")

                # Ingest multimodal signal
                self.agent.ingest(
                    student_id=stu["id"],
                    name=stu["name"],
                    timestamp=float(t),
                    presence_duration=presence,
                    movement_score=movement,
                    speech_ratio=audio_frame.speech_ratio,
                    inactivity_duration=inactivity,
                    attendance_status=status
                )

        logger.info("✅ Session recording completed. Generating analytical reports...")
        return self._generate_and_save_artifacts(session_id)

    def _generate_and_save_artifacts(self, session_id: str):
        """Generates summary JSON, attendance log CSV, and prints console reports."""
        summary = self.agent.get_session_summary()
        summary["session_id"] = session_id
        summary["audio_stats"] = self.audio.stats.to_dict()

        # 1. Save Session Summary JSON
        json_path = self.output_dir / f"{session_id}_summary.json"
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(summary, f, indent=2)
        logger.info(f"💾 Saved Session Summary JSON: {json_path}")

        # 2. Save Timestamped Attendance Log CSV
        csv_path = self.output_dir / f"{session_id}_attendance.csv"
        with open(csv_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["student_id", "name", "attendance_status", "avg_engagement", "engagement_label", "trend"])
            for stu in summary["student_analytics"]:
                writer.writerow([
                    stu["student_id"],
                    stu["name"],
                    stu["attendance_status"],
                    f"{stu['avg_engagement_score']:.1%}",
                    stu["engagement_label"],
                    stu["engagement_trend"]
                ])
        logger.info(f"💾 Saved Attendance CSV: {csv_path}")

        # 3. Print Console Dashboard
        print("\n" + "=" * 70)
        print("🎓 MULTIMODAL ATTENDANCE & ENGAGEMENT AGENT — SESSION REPORT")
        print("=" * 70)
        print(f"Session ID       : {session_id}")
        print(f"Class Avg Score  : {summary['class_average_engagement']:.1%}")
        print(f"Audio Speech %   : {summary['audio_stats']['overall_speech_ratio']:.1%}")
        print(f"Ambient Noise    : {summary['audio_stats']['noise_profile'].upper()}")
        print("-" * 70)
        print("📋 ATTENDANCE & INDIVIDUAL ENGAGEMENT BREAKDOWN:")
        for stu in summary["student_analytics"]:
            status_flag = "🟢 PRESENT" if stu["attendance_status"] == "present" else ("🔴 ABSENT " if stu["attendance_status"] == "absent" else "🟡 PENDING")
            print(
                f"  {stu['name']:18s} | {status_flag} | "
                f"Score: {stu['avg_engagement_score']:5.1%} ({stu['engagement_label']:16s}) | "
                f"Trend: {stu['engagement_trend']}"
            )
        print("-" * 70)
        print(f"💡 AI TEACHING SUGGESTIONS ({len(summary['teaching_suggestions'])} Generated):")
        if not summary["teaching_suggestions"]:
            print("  🌟 Session engagement steady and balanced — no immediate interventions needed.")
        for s in summary["teaching_suggestions"]:
            print(f"  [{s['priority'].upper():6s}] {s['suggestion']}")
        print("=" * 70 + "\n")

        return {
            "session_id": session_id,
            "json_path": str(json_path),
            "csv_path": str(csv_path),
            "summary": summary
        }


def main():
    parser = argparse.ArgumentParser(description="AttendAI Core Multimodal Application")
    parser.add_argument("--duration", type=int, default=15, help="Session duration in seconds (default: 15)")
    parser.add_argument("--students", type=int, default=5, help="Number of students to track (default: 5)")
    parser.add_argument("--out", type=str, default="reports", help="Output directory for reports")
    parser.add_argument("--mock", action="store_true", default=True, help="Force mock audio & vision data")
    args = parser.parse_args()

    runner = AttendAICoreRunner(
        video_source=0,
        audio_source="mock",
        output_dir=args.out,
        mock_mode=args.mock
    )
    runner.run_simulation_session(duration_seconds=args.duration, num_students=args.students)


if __name__ == "__main__":
    main()
