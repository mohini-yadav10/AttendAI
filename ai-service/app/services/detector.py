import time
import base64
import numpy as np
from typing import List
from app.schemas.detection import DetectionResponse, BoundingBox
from app.services.mock_adapter import generate_mock_detection

def detect_faces_from_bytes(image_bytes: bytes, mock_mode: bool = False) -> DetectionResponse:
    start_time = time.time()
    
    if mock_mode:
        return generate_mock_detection()

    try:
        import cv2

        # Decode image from buffer
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            return DetectionResponse(
                success=False,
                face_count=0,
                faces=[],
                processing_time_ms=0,
                is_mock=False,
                error="Invalid or corrupted image format."
            )

        h, w, _ = img.shape
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Use OpenCV built-in frontal face Haar Cascade
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        detected = face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(30, 30)
        )

        faces: List[BoundingBox] = []
        for (x, y, fw, fh) in detected:
            faces.append(BoundingBox(
                x=int(x),
                y=int(y),
                width=int(fw),
                height=int(fh),
                confidence=0.92
            ))

        elapsed_ms = (time.time() - start_time) * 1000

        return DetectionResponse(
            success=True,
            face_count=len(faces),
            faces=faces,
            processing_time_ms=round(elapsed_ms, 2),
            is_mock=False,
            image_width=w,
            image_height=h
        )
    except Exception as e:
        # Graceful fallback to mock detection with error note
        mock_resp = generate_mock_detection()
        mock_resp.mock_disclaimer = f"OpenCV fallback triggered: {str(e)}"
        return mock_resp

def detect_faces_from_base64(b64_string: str, mock_mode: bool = False) -> DetectionResponse:
    if ',' in b64_string:
        b64_string = b64_string.split(',', 1)[1]
    
    try:
        image_bytes = base64.b64decode(b64_string)
    except Exception:
        return DetectionResponse(
            success=False,
            face_count=0,
            faces=[],
            processing_time_ms=0,
            is_mock=False,
            error="Malformed base64 image data."
        )

    return detect_faces_from_bytes(image_bytes, mock_mode=mock_mode)
