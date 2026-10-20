"""
Multimodal Attendance & Engagement Agent
Milestone 4: Multimodal Agent — Signal Fusion & Engagement Scoring
Milestone 5: Analytics & Recommendation Engine — Teaching Suggestions & Student Analytics
Activity 4.1: Multimodal signal fusion
Activity 4.2: Engagement scoring logic
Activity 5.1: Teaching suggestion logic
Activity 5.2: Student analytics generation
"""

import sys
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

import numpy as np
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


# ─── Engagement Signal Weights (Milestone 4: Multimodal Fusion) ─────────────
WEIGHT_PRESENCE     = 0.35   # Sustained face presence duration
WEIGHT_MOVEMENT     = 0.20   # Body movement variability
WEIGHT_AUDIO_SPEECH = 0.25   # Active speech / interaction level
WEIGHT_INACTIVITY   = 0.20   # Inverse of inactivity penalty


@dataclass
class EngagementSignal:
    """
    Activity 4.1 — Fused per-student multimodal signal snapshot.
    Combines vision and audio signals at a single time interval.
    """
    timestamp: float
    student_id: int
    name: str
    presence_duration: float       # From Vision Module (seconds sustained)
    movement_score: float          # Head pose variance (0.0–1.0)
    speech_ratio: float            # From Audio Module (0.0–1.0 rolling)
    inactivity_duration: float     # Seconds since last detected motion
    raw_engagement_score: float = 0.0

    def compute_score(self) -> float:
        """
        Activity 4.2 — Rule-based weighted engagement score (0.0–1.0).
        Higher is more engaged.
        """
        presence_norm = min(self.presence_duration / 300.0, 1.0)       # 5 min max
        inactivity_penalty = 1.0 - min(self.inactivity_duration / 60.0, 1.0)  # 1 min max penalty

        self.raw_engagement_score = (
            WEIGHT_PRESENCE     * presence_norm +
            WEIGHT_MOVEMENT     * min(self.movement_score, 1.0) +
            WEIGHT_AUDIO_SPEECH * min(self.speech_ratio, 1.0) +
            WEIGHT_INACTIVITY   * inactivity_penalty
        )
        return round(self.raw_engagement_score, 4)


@dataclass
class SessionEngagementRecord:
    """Stores the complete engagement history for one student per session."""
    student_id: int
    name: str
    signals: List[EngagementSignal] = field(default_factory=list)
    attendance_status: str = "pending"

    @property
    def avg_engagement(self) -> float:
        if not self.signals:
            return 0.0
        return round(np.mean([s.raw_engagement_score for s in self.signals]), 3)

    @property
    def trend(self) -> str:
        """Derive engagement trend from first and last quarter of signals."""
        if len(self.signals) < 4:
            return "insufficient_data"
        n = len(self.signals)
        first_q  = np.mean([s.raw_engagement_score for s in self.signals[:n//4]])
        last_q   = np.mean([s.raw_engagement_score for s in self.signals[3*n//4:]])
        delta = last_q - first_q
        if delta > 0.1:
            return "improving"
        elif delta < -0.1:
            return "declining"
        return "stable"

    @property
    def attention_drop_intervals(self) -> List[Tuple[float, float]]:
        """Identify contiguous intervals where engagement drops below 0.3."""
        drops = []
        in_drop, start = False, 0.0
        for s in self.signals:
            if s.raw_engagement_score < 0.30 and not in_drop:
                in_drop, start = True, s.timestamp
            elif s.raw_engagement_score >= 0.30 and in_drop:
                in_drop = False
                drops.append((start, s.timestamp))
        if in_drop and self.signals:
            drops.append((start, self.signals[-1].timestamp))
        return drops


class MultimodalAgent:
    """
    Milestone 4: Multimodal Signal Fusion Engine
    Milestone 5: Analytics & Teaching Suggestion Engine

    Consumes per-frame signals from VisionModule and AudioModule,
    fuses them into EngagementSignal snapshots, and generates
    actionable instructor recommendations.
    """

    def __init__(self):
        self.records: Dict[int, SessionEngagementRecord] = {}
        self.session_start_time = datetime.now()
        self._interval_seconds = 10.0   # Sample engagement every N seconds

    def ingest(
        self,
        student_id: int,
        name: str,
        timestamp: float,
        presence_duration: float,
        movement_score: float,
        speech_ratio: float,
        inactivity_duration: float,
        attendance_status: str = "pending",
    ) -> EngagementSignal:
        """
        Activity 4.1 — Fuse vision and audio signals into a single engagement snapshot.
        """
        signal = EngagementSignal(
            timestamp=timestamp,
            student_id=student_id,
            name=name,
            presence_duration=presence_duration,
            movement_score=movement_score,
            speech_ratio=speech_ratio,
            inactivity_duration=inactivity_duration,
        )
        signal.compute_score()

        if student_id not in self.records:
            self.records[student_id] = SessionEngagementRecord(
                student_id=student_id, name=name
            )
        self.records[student_id].signals.append(signal)
        self.records[student_id].attendance_status = attendance_status

        return signal

    # ── Activity 5.1: Teaching Suggestion Logic ──────────────────────────────

    def generate_teaching_suggestions(self) -> List[dict]:
        """
        Activity 5.1 — Analyze engagement records and generate context-aware,
        non-enforcing pedagogical suggestions for the instructor.
        """
        suggestions = []

        if not self.records:
            return suggestions

        all_avg_scores = [rec.avg_engagement for rec in self.records.values()]
        class_avg = np.mean(all_avg_scores) if all_avg_scores else 0.0
        low_engagement_students = [
            r for r in self.records.values() if r.avg_engagement < 0.40
        ]
        declining_students = [
            r for r in self.records.values() if r.trend == "declining"
        ]

        # Suggestion 1: Class-wide low engagement
        if class_avg < 0.45:
            suggestions.append({
                "priority": "high",
                "type": "pacing_adjustment",
                "trigger": f"Class average engagement dropped to {class_avg:.0%}",
                "suggestion": (
                    "📌 Consider introducing an interactive activity — a quick poll, "
                    "think-pair-share, or a comprehension question — to re-engage "
                    "the class before continuing lecture content."
                ),
            })

        # Suggestion 2: Multiple students with declining engagement
        if len(declining_students) > max(1, len(self.records) * 0.3):
            names = ", ".join(r.name for r in declining_students[:3])
            suggestions.append({
                "priority": "high",
                "type": "engagement_recovery",
                "trigger": f"{len(declining_students)} students show declining engagement",
                "suggestion": (
                    f"📉 Engagement is declining for: {names}. "
                    "Consider slowing the pacing, offering a 2-minute collaborative "
                    "discussion segment, or checking in with these students directly."
                ),
            })

        # Suggestion 3: Individual at-risk students
        for student in low_engagement_students[:5]:
            drop_intervals = student.attention_drop_intervals
            if drop_intervals:
                total_drop = sum(e - s for s, e in drop_intervals)
                suggestions.append({
                    "priority": "medium",
                    "type": "individual_check_in",
                    "trigger": f"{student.name} disengaged for {total_drop:.0f}s",
                    "suggestion": (
                        f"🎯 {student.name} has shown {total_drop:.0f}s of low engagement. "
                        "Direct a question or brief task to this student to re-activate participation."
                    ),
                })

        # Suggestion 4: High class engagement — positive reinforcement
        if class_avg > 0.75:
            suggestions.append({
                "priority": "low",
                "type": "positive_momentum",
                "trigger": f"Class engagement at {class_avg:.0%} — peak performance",
                "suggestion": (
                    "🌟 Excellent engagement across the class! This is a great moment "
                    "to introduce a more challenging concept or open the floor for "
                    "deeper discussion — the class is primed to learn."
                ),
            })

        # Suggestion 5: Low audio activity despite visual presence
        avg_speech = np.mean([
            s.speech_ratio
            for rec in self.records.values()
            for s in rec.signals[-10:]   # last 10 signals
        ] or [0.0])

        if avg_speech < 0.15 and class_avg > 0.50:
            suggestions.append({
                "priority": "medium",
                "type": "participation_prompt",
                "trigger": f"Low verbal interaction ({avg_speech:.0%} speech ratio)",
                "suggestion": (
                    "🔇 Students appear visually present but verbal interaction is very low. "
                    "Try a cold-call round or small group discussion to increase spoken participation."
                ),
            })

        logger.info(f"💡 {len(suggestions)} teaching suggestion(s) generated for instructor.")
        return suggestions

    # ── Activity 5.2: Student Analytics Generation ────────────────────────────

    def generate_student_analytics(self) -> List[dict]:
        """
        Activity 5.2 — Generate per-student session analytics for the student portal.
        """
        analytics = []
        for sid, rec in self.records.items():
            analytics.append({
                "student_id": rec.student_id,
                "name": rec.name,
                "attendance_status": rec.attendance_status,
                "avg_engagement_score": rec.avg_engagement,
                "engagement_label": self._label_engagement(rec.avg_engagement),
                "engagement_trend": rec.trend,
                "attention_drop_count": len(rec.attention_drop_intervals),
                "total_signals_captured": len(rec.signals),
                "peak_engagement": round(
                    max((s.raw_engagement_score for s in rec.signals), default=0.0), 3
                ),
                "lowest_engagement": round(
                    min((s.raw_engagement_score for s in rec.signals), default=0.0), 3
                ),
            })
        return analytics

    @staticmethod
    def _label_engagement(score: float) -> str:
        if score >= 0.75:
            return "Highly Engaged"
        elif score >= 0.55:
            return "Engaged"
        elif score >= 0.35:
            return "Partially Engaged"
        return "Low Engagement"

    def get_session_summary(self) -> dict:
        """Combined session-level summary for dashboard display."""
        analytics = self.generate_student_analytics()
        suggestions = self.generate_teaching_suggestions()
        scores = [a["avg_engagement_score"] for a in analytics]

        return {
            "session_start": self.session_start_time.isoformat(),
            "total_students_tracked": len(self.records),
            "class_average_engagement": round(np.mean(scores), 3) if scores else 0.0,
            "student_analytics": analytics,
            "teaching_suggestions": suggestions,
            "generated_at": datetime.now().isoformat(),
        }


# ─── Entry Point — Milestone 4 + 5 Simulation ────────────────────────────────
if __name__ == "__main__":
    import random

    agent = MultimodalAgent()

    # Simulate 10 students across a 15-minute session (90 x 10-second intervals)
    students = [
        {"id": i, "name": f"Student-{i:02d}"}
        for i in range(1, 11)
    ]

    for interval in range(90):
        t = float(interval * 10)
        for stu in students:
            # Simulate varying engagement across session time
            if interval < 20:
                base = 0.7 + random.gauss(0, 0.1)   # High initial engagement
            elif interval < 60:
                base = 0.5 + random.gauss(0, 0.15)  # Mid-session variability
            else:
                base = 0.4 + random.gauss(0, 0.2)   # Late-session fatigue

            agent.ingest(
                student_id=stu["id"],
                name=stu["name"],
                timestamp=t,
                presence_duration=t,
                movement_score=max(0, base + random.gauss(0, 0.1)),
                speech_ratio=max(0, base * 0.6 + random.gauss(0, 0.1)),
                inactivity_duration=max(0, (1.0 - base) * 30),
                attendance_status="present" if t > 5 else "pending",
            )

    summary = agent.get_session_summary()

    print("\n" + "=" * 60)
    print("📊 SESSION ANALYTICS SUMMARY")
    print("=" * 60)
    print(f"  Class Avg Engagement : {summary['class_average_engagement']:.0%}")
    print(f"  Students Tracked     : {summary['total_students_tracked']}")
    print(f"\n📋 Per-Student Breakdown:")
    for a in summary["student_analytics"]:
        print(
            f"  {a['name']:15s} | {a['engagement_label']:18s} | "
            f"{a['avg_engagement_score']:.0%} | Trend: {a['engagement_trend']}"
        )
    print(f"\n💡 Teaching Suggestions ({len(summary['teaching_suggestions'])}):")
    for s in summary["teaching_suggestions"]:
        print(f"  [{s['priority'].upper():6s}] {s['suggestion'][:90]}...")
