import time
from typing import List
from app.schemas.detection import DetectionResponse, BoundingBox

def generate_mock_detection(image_width: int = 640, image_height: int = 480) -> DetectionResponse:
    start_time = time.time()
    
    # Realistic simulated face bounding boxes
    faces: List[BoundingBox] = [
        BoundingBox(x=120, y=90, width=80, height=100, confidence=0.96),
        BoundingBox(x=250, y=105, width=85, height=105, confidence=0.92),
        BoundingBox(x=380, y=85, width=90, height=110, confidence=0.89),
        BoundingBox(x=170, y=230, width=82, height=102, confidence=0.94),
        BoundingBox(x=310, y=225, width=88, height=108, confidence=0.91),
    ]
    
    elapsed_ms = (time.time() - start_time) * 1000 + 42.0

    return DetectionResponse(
        success=True,
        face_count=len(faces),
        faces=faces,
        processing_time_ms=round(elapsed_ms, 2),
        is_mock=True,
        mock_disclaimer="Mock Mode Active: Simulated facial coordinates generated for demonstration.",
        image_width=image_width,
        image_height=image_height
    )
