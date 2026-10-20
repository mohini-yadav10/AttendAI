"""
Multimodal Attendance & Engagement Agent
Milestone 3: Audio Module — Signal Extraction, Noise & Speech Activity Detection
Activity 3.1: Audio signal extraction
Activity 3.2: Noise and speech activity analysis
"""

import sys
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

import numpy as np
import logging
from dataclasses import dataclass, field
from typing import List, Optional
from datetime import datetime

logger = logging.getLogger(__name__)

# ─── Optional heavy deps — gracefully degrade if not installed ───────────────
try:
    import pyaudio
    PYAUDIO_AVAILABLE = True
except ImportError:
    PYAUDIO_AVAILABLE = False
    logger.warning("pyaudio not installed — audio capture will use mock mode")

try:
    import webrtcvad
    WEBRTCVAD_AVAILABLE = True
except ImportError:
    WEBRTCVAD_AVAILABLE = False
    logger.warning("webrtcvad not installed — VAD will use energy threshold fallback")

try:
    import librosa
    LIBROSA_AVAILABLE = True
except ImportError:
    LIBROSA_AVAILABLE = False


# ─── Constants ───────────────────────────────────────────────────────────────
SAMPLE_RATE       = 16000    # Hz — WebRTC VAD requires 8kHz, 16kHz, or 32kHz
FRAME_DURATION_MS = 30       # ms per frame (10, 20, or 30 — WebRTC VAD constraint)
FRAME_SIZE        = int(SAMPLE_RATE * FRAME_DURATION_MS / 1000)  # samples per frame
CHANNELS          = 1        # Mono audio
ENERGY_THRESHOLD  = 0.02     # RMS energy fallback threshold for speech detection
VAD_MODE          = 2        # WebRTC VAD aggressiveness: 0 (permissive) to 3 (aggressive)


@dataclass
class AudioFrame:
    """Represents a single captured audio frame with analysis results."""
    timestamp: float
    raw_pcm: bytes
    rms_energy: float
    is_speech: bool
    noise_level: str   # "low" | "moderate" | "high"
    speech_ratio: float = 0.0   # rolling ratio over last N frames


@dataclass
class SessionAudioStats:
    """Aggregated audio analytics for a complete session."""
    total_frames: int = 0
    speech_frames: int = 0
    avg_energy: float = 0.0
    peak_energy: float = 0.0
    interaction_intervals: List[tuple] = field(default_factory=list)
    speech_ratio_trend: List[float] = field(default_factory=list)
    noise_profile: str = "unknown"

    @property
    def overall_speech_ratio(self) -> float:
        if self.total_frames == 0:
            return 0.0
        return self.speech_frames / self.total_frames

    def to_dict(self) -> dict:
        return {
            "total_frames": self.total_frames,
            "speech_frames": self.speech_frames,
            "overall_speech_ratio": round(self.overall_speech_ratio, 3),
            "avg_energy": round(self.avg_energy, 4),
            "peak_energy": round(self.peak_energy, 4),
            "noise_profile": self.noise_profile,
            "interaction_intervals_count": len(self.interaction_intervals),
        }


class VADEngine:
    """
    Activity 3.2 — Voice Activity Detector.
    Uses WebRTC VAD when available, falls back to RMS energy threshold.
    """

    def __init__(self, mode: int = VAD_MODE):
        self._vad = None
        if WEBRTCVAD_AVAILABLE:
            self._vad = webrtcvad.Vad(mode)
            logger.info(f"WebRTC VAD initialized (mode={mode})")
        else:
            logger.info("Energy-threshold VAD initialized (fallback mode)")

    def is_speech(self, pcm_bytes: bytes, sample_rate: int = SAMPLE_RATE) -> bool:
        """Detect whether a PCM frame contains speech."""
        if self._vad:
            try:
                return self._vad.is_speech(pcm_bytes, sample_rate)
            except Exception:
                pass
        # Fallback: RMS energy threshold
        arr = np.frombuffer(pcm_bytes, dtype=np.int16).astype(np.float32) / 32768.0
        return float(np.sqrt(np.mean(arr ** 2))) > ENERGY_THRESHOLD


class AudioModule:
    """
    Milestone 3 Orchestrator: Audio Module.

    Activity 3.1 — Captures audio frames from microphone or simulates from array.
    Activity 3.2 — Analyzes each frame for:
        - Speech / noise classification (WebRTC VAD)
        - RMS energy level
        - Noise profile classification
        - Rolling speech ratio over time (for engagement trend)
    """

    def __init__(self, source: str = "mic"):
        """
        Args:
            source: "mic" for live microphone capture, or "mock" for simulation.
        """
        self.source = source
        self.vad = VADEngine()
        self.stats = SessionAudioStats()
        self._frames_buffer: List[AudioFrame] = []
        self._rolling_window = 50   # frames for rolling speech ratio

        if source == "mic" and PYAUDIO_AVAILABLE:
            self._pa = pyaudio.PyAudio()
            self._stream: Optional[pyaudio.Stream] = None
        else:
            self._pa = None
            self._stream = None
            if source == "mic":
                logger.warning("Microphone requested but pyaudio unavailable — switching to mock mode")
                self.source = "mock"

    def _open_stream(self):
        if self._pa:
            self._stream = self._pa.open(
                format=pyaudio.paInt16,
                channels=CHANNELS,
                rate=SAMPLE_RATE,
                input=True,
                frames_per_buffer=FRAME_SIZE,
            )

    def _close_stream(self):
        if self._stream:
            self._stream.stop_stream()
            self._stream.close()
        if self._pa:
            self._pa.terminate()

    def _read_frame(self) -> bytes:
        """Read one frame from the microphone stream."""
        if self._stream:
            return self._stream.read(FRAME_SIZE, exception_on_overflow=False)
        return b"\x00" * (FRAME_SIZE * 2)

    def _mock_frame(self, timestamp: float) -> bytes:
        """
        Generate a realistic mock audio frame for safe offline testing.
        Simulates bursts of activity (speech) and silent periods.
        """
        t = timestamp % 8.0
        if 1.0 < t < 4.0:  # Simulate 3-second speech burst every 8 seconds
            noise = np.random.normal(0, 2500, FRAME_SIZE).astype(np.int16)
        else:
            noise = np.random.normal(0, 200, FRAME_SIZE).astype(np.int16)
        return noise.tobytes()

    def _compute_rms(self, pcm: bytes) -> float:
        arr = np.frombuffer(pcm, dtype=np.int16).astype(np.float32) / 32768.0
        return float(np.sqrt(np.mean(arr ** 2)))

    def _classify_noise(self, rms: float) -> str:
        if rms < 0.01:
            return "low"
        elif rms < 0.05:
            return "moderate"
        return "high"

    def _rolling_speech_ratio(self) -> float:
        """Calculate speech ratio over the last N frames (engagement trend signal)."""
        recent = self._frames_buffer[-self._rolling_window:]
        if not recent:
            return 0.0
        return sum(1 for f in recent if f.is_speech) / len(recent)

    def process_frame(self, timestamp: float) -> AudioFrame:
        """
        Activity 3.1 + 3.2 combined:
        Capture (or mock) one frame and run full noise/speech analysis.
        """
        if self.source == "mock":
            pcm = self._mock_frame(timestamp)
        else:
            pcm = self._read_frame()

        rms = self._compute_rms(pcm)
        speech = self.vad.is_speech(pcm)
        noise_level = self._classify_noise(rms)

        frame = AudioFrame(
            timestamp=timestamp,
            raw_pcm=pcm,
            rms_energy=rms,
            is_speech=speech,
            noise_level=noise_level,
        )
        self._frames_buffer.append(frame)
        frame.speech_ratio = self._rolling_speech_ratio()

        # Update session stats
        self.stats.total_frames += 1
        if speech:
            self.stats.speech_frames += 1
        self.stats.avg_energy = (
            (self.stats.avg_energy * (self.stats.total_frames - 1) + rms)
            / self.stats.total_frames
        )
        self.stats.peak_energy = max(self.stats.peak_energy, rms)
        self.stats.speech_ratio_trend.append(frame.speech_ratio)
        self.stats.noise_profile = noise_level

        return frame

    def run(self, duration_seconds: float = 60.0, display_interval: int = 50) -> SessionAudioStats:
        """
        Run the audio module for a specified duration.
        Logs speech activity and returns aggregated session stats.
        """
        logger.info(f"🎙 Audio Module started — source: {self.source}, duration: {duration_seconds}s")
        if self.source == "mic":
            self._open_stream()

        start = 0.0
        t = start
        step = FRAME_DURATION_MS / 1000.0
        frame_count = 0

        try:
            while t < duration_seconds:
                frame = self.process_frame(t)
                frame_count += 1
                t += step

                if frame_count % display_interval == 0:
                    logger.info(
                        f"  t={t:.1f}s | RMS={frame.rms_energy:.4f} | "
                        f"Speech={'YES' if frame.is_speech else 'NO ':3s} | "
                        f"Noise={frame.noise_level:8s} | "
                        f"SpeechRatio={frame.speech_ratio:.0%}"
                    )
        finally:
            if self.source == "mic":
                self._close_stream()

        logger.info(f"\n{'='*60}")
        logger.info("AUDIO SESSION SUMMARY:")
        for k, v in self.stats.to_dict().items():
            logger.info(f"  {k:35s}: {v}")
        logger.info(f"{'='*60}\n")

        return self.stats


# ─── Entry Point ─────────────────────────────────────────────────────────────
if __name__ == "__main__":
    module = AudioModule(source="mock")
    stats = module.run(duration_seconds=30.0)

    print("\n🎙 AUDIO ANALYSIS REPORT:")
    for k, v in stats.to_dict().items():
        print(f"  {k}: {v}")
