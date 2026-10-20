"""
Multimodal Attendance & Engagement Agent
Milestone 2: Vision Module — Face Detection, Tracking & Presence-Based Attendance
Activity 2.1: Face detection and tracking
Activity 2.2: Presence-based attendance logic
"""

import sys
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

import cv2
import numpy as np
from datetime import datetime
from typing import Dict, List, Optional, Tuple
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

# ─── Constants ──────────────────────────────────────────────────────────────
PRESENCE_THRESHOLD_SECONDS = 5    # Minimum seconds sustained to mark as PRESENT
ABSENCE_TIMEOUT_SECONDS    = 10   # Seconds without detection to mark as ABSENT
FACE_CASCADE_PATH          = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
PROFILE_CASCADE_PATH       = cv2.data.haarcascades + "haarcascade_profileface.xml"


class FaceTracker:
    """
    Tracks detected faces across video frames using bounding-box IoU matching.
    Assigns stable IDs to persist across frames and calculates presence durations.
    """

    def __init__(self):
        self.tracks: Dict[int, dict] = {}   # track_id -> {bbox, first_seen, last_seen, name}
        self.next_id: int = 1
        self.iou_threshold: float = 0.4

    def _iou(self, boxA: Tuple, boxB: Tuple) -> float:
        """Compute Intersection over Union of two bounding boxes (x, y, w, h)."""
        ax1, ay1 = boxA[0], boxA[1]
        ax2, ay2 = boxA[0] + boxA[2], boxA[1] + boxA[3]
        bx1, by1 = boxB[0], boxB[1]
        bx2, by2 = boxB[0] + boxB[2], boxB[1] + boxB[3]

        inter_x1, inter_y1 = max(ax1, bx1), max(ay1, by1)
        inter_x2, inter_y2 = min(ax2, bx2), min(ay2, by2)

        inter_area = max(0, inter_x2 - inter_x1) * max(0, inter_y2 - inter_y1)
        union_area = (ax2 - ax1) * (ay2 - ay1) + (bx2 - bx1) * (by2 - by1) - inter_area

        return inter_area / union_area if union_area > 0 else 0.0

    def update(self, detected_bboxes: List[Tuple], timestamp: float) -> Dict[int, dict]:
        """
        Match incoming detected bounding boxes to existing tracked faces.
        Returns the current set of active tracks with updated timestamps.
        """
        matched_ids = set()

        for bbox in detected_bboxes:
            best_id, best_iou = None, 0.0
            for tid, track in self.tracks.items():
                iou = self._iou(bbox, track["bbox"])
                if iou > best_iou:
                    best_iou = iou
                    best_id = tid

            if best_iou >= self.iou_threshold and best_id not in matched_ids:
                # Match found — update existing track
                self.tracks[best_id]["bbox"] = bbox
                self.tracks[best_id]["last_seen"] = timestamp
                matched_ids.add(best_id)
            else:
                # New face — initialize a fresh track
                self.tracks[self.next_id] = {
                    "bbox": bbox,
                    "first_seen": timestamp,
                    "last_seen": timestamp,
                    "name": f"Person-{self.next_id}",
                    "presence_duration": 0.0,
                }
                matched_ids.add(self.next_id)
                self.next_id += 1

        # Update presence durations for all active tracks
        for tid in list(self.tracks):
            track = self.tracks[tid]
            if tid in matched_ids:
                track["presence_duration"] = track["last_seen"] - track["first_seen"]
            elif (timestamp - track["last_seen"]) > ABSENCE_TIMEOUT_SECONDS:
                del self.tracks[tid]   # Remove stale track

        return self.tracks


class AttendanceEngine:
    """
    Milestone 2 — Activity 2.2: Presence-Based Attendance Logic
    Marks students PRESENT only when sustained presence exceeds the threshold,
    preventing false positives from brief appearances or passersby.
    """

    def __init__(
        self,
        presence_threshold: float = PRESENCE_THRESHOLD_SECONDS,
        absence_timeout: float = ABSENCE_TIMEOUT_SECONDS
    ):
        self.presence_threshold = presence_threshold
        self.absence_timeout = absence_timeout
        self.records: Dict[int, dict] = {}

    @property
    def attendance_records(self) -> Dict[int, dict]:
        return self.records

    def process(self, tracks: Dict[int, dict]) -> Dict[int, dict]:
        """
        Evaluate all tracked faces and update attendance records.
        """
        for tid, track in tracks.items():
            if tid not in self.records:
                self.records[tid] = {
                    "track_id": tid,
                    "name": track["name"],
                    "status": "pending",
                    "marked_at": None,
                    "presence_duration": 0.0,
                    "first_seen": track.get("first_seen", 0.0),
                    "last_seen": track.get("last_seen", 0.0),
                }

            self.records[tid]["last_seen"] = track.get("last_seen", self.records[tid]["last_seen"])
            # Calculate presence duration if not directly provided
            if "presence_duration" in track:
                self.records[tid]["presence_duration"] = track["presence_duration"]
            elif "first_seen" in track and "last_seen" in track:
                self.records[tid]["presence_duration"] = track["last_seen"] - track["first_seen"]

            if (
                self.records[tid]["presence_duration"] >= self.presence_threshold
                and self.records[tid]["status"] != "present"
            ):
                self.records[tid]["status"] = "present"
                try:
                    self.records[tid]["marked_at"] = datetime.fromtimestamp(
                        track["last_seen"]
                    ).strftime("%Y-%m-%d %H:%M:%S")
                except Exception:
                    self.records[tid]["marked_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                logger.info(
                    f"✅ PRESENT: {track['name']} — "
                    f"{self.records[tid]['presence_duration']:.1f}s sustained presence"
                )

        return self.records

    def check_absences(self, current_time: float) -> Dict[int, dict]:
        """
        Marks unconfirmed pending tracks as absent if last seen exceeds absence timeout.
        """
        for tid, rec in self.records.items():
            if rec["status"] == "pending":
                time_since_seen = current_time - rec["last_seen"]
                if time_since_seen >= self.absence_timeout:
                    rec["status"] = "absent"
                    logger.info(f"❌ ABSENT: {rec['name']} — missing for {time_since_seen:.1f}s")
        return self.records

    def get_log(self) -> List[dict]:
        """Return timestamped attendance log."""
        return [
            {
                "track_id": rec["track_id"],
                "name": rec["name"],
                "status": rec["status"],
                "marked_at": rec["marked_at"],
                "presence_seconds": round(rec["presence_duration"], 2),
            }
            for rec in self.records.values()
        ]


class VisionModule:
    """
    Top-level Milestone 2 orchestrator.
    Processes a video source (camera / file), runs face detection,
    feeds detections into FaceTracker, and evaluates attendance via AttendanceEngine.
    """

    def __init__(self, source: int | str = 0):
        """
        Args:
            source: Camera index (0 = default webcam) or path to a video file.
        """
        self.source = source
        self.face_cascade = cv2.CascadeClassifier(FACE_CASCADE_PATH)
        self.profile_cascade = cv2.CascadeClassifier(PROFILE_CASCADE_PATH)
        self.tracker = FaceTracker()
        self.attendance = AttendanceEngine()

    def detect_faces(self, frame_gray: np.ndarray) -> List[Tuple]:
        """
        Run frontal and profile Haar cascade detection on a grayscale frame.
        Returns a deduplicated list of bounding boxes.
        """
        frontal = self.face_cascade.detectMultiScale(
            frame_gray, scaleFactor=1.15, minNeighbors=5, minSize=(50, 50)
        )
        profile = self.profile_cascade.detectMultiScale(
            frame_gray, scaleFactor=1.15, minNeighbors=5, minSize=(50, 50)
        )

        boxes = []
        for arr in [frontal, profile]:
            if len(arr) > 0:
                boxes.extend([tuple(b) for b in arr])

        return boxes

    def annotate_frame(self, frame: np.ndarray, tracks: Dict[int, dict]) -> np.ndarray:
        """Draw bounding boxes and presence labels onto the video frame."""
        for tid, track in tracks.items():
            x, y, w, h = track["bbox"]
            color = (34, 197, 94) if track["presence_duration"] >= PRESENCE_THRESHOLD_SECONDS else (251, 191, 36)
            cv2.rectangle(frame, (x, y), (x + w, y + h), color, 2)
            label = f"{track['name']} ({track['presence_duration']:.0f}s)"
            cv2.putText(frame, label, (x, y - 8), cv2.FONT_HERSHEY_SIMPLEX, 0.45, color, 1)
        return frame

    def run(self, display: bool = True, max_frames: Optional[int] = None) -> List[dict]:
        """
        Main processing loop.
        Returns the final attendance log after the session ends.
        """
        cap = cv2.VideoCapture(self.source)
        if not cap.isOpened():
            raise RuntimeError(f"Cannot open video source: {self.source}")

        logger.info(f"🎬 Vision Module started — source: {self.source}")
        frame_count = 0

        try:
            while True:
                ret, frame = cap.read()
                if not ret:
                    break

                frame_count += 1
                timestamp = cap.get(cv2.CAP_PROP_POS_MSEC) / 1000.0 or float(frame_count) / 30.0

                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                gray = cv2.equalizeHist(gray)

                detected_bboxes = self.detect_faces(gray)
                tracks = self.tracker.update(detected_bboxes, timestamp)
                self.attendance.process(tracks)

                if display:
                    annotated = self.annotate_frame(frame.copy(), tracks)
                    cv2.imshow("AttendAI — Multimodal Vision Module", annotated)
                    if cv2.waitKey(1) & 0xFF == ord("q"):
                        break

                if max_frames and frame_count >= max_frames:
                    break
        finally:
            cap.release()
            if display:
                cv2.destroyAllWindows()

        log = self.attendance.get_log()
        logger.info(f"\n{'='*60}")
        logger.info(f"SESSION ENDED — {frame_count} frames processed")
        logger.info(f"Attendance Summary:")
        for entry in log:
            logger.info(f"  {entry['name']:20s} | {entry['status']:10s} | {entry['presence_seconds']}s")
        logger.info(f"{'='*60}\n")

        return log


# ─── Entry Point ─────────────────────────────────────────────────────────────
if __name__ == "__main__":
    module = VisionModule(source=0)
    log = module.run(display=True)

    print("\n📋 TIMESTAMPED ATTENDANCE LOG:")
    for entry in log:
        print(
            f"  [{entry['marked_at'] or 'PENDING'}] {entry['name']:20s} "
            f"→ {entry['status'].upper():10s} ({entry['presence_seconds']}s)"
        )
