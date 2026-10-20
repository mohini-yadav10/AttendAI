import os
from fastapi import APIRouter, File, UploadFile, HTTPException, Request
from app.schemas.detection import DetectionResponse, Base64ImageRequest, MatchFacesResponse
from app.services.detector import detect_faces_from_bytes, detect_faces_from_base64

router = APIRouter(tags=["Detection"])

MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5MB

def is_mock_mode() -> bool:
    return os.getenv("AI_MOCK_MODE", "true").lower() in ("true", "1", "yes")

@router.post("/detect-faces", response_model=DetectionResponse)
async def detect_faces(
    request: Request,
    file: UploadFile = File(None)
):
    mock = is_mock_mode()

    if file:
        content = await file.read()
        if len(content) > MAX_IMAGE_SIZE:
            raise HTTPException(status_code=413, detail="File size exceeds the 5MB limit.")
        if len(content) == 0:
            raise HTTPException(status_code=400, detail="Empty file uploaded.")
        return detect_faces_from_bytes(content, mock_mode=mock)

    # Check for JSON payload
    try:
        body = await request.json()
        image_base64 = body.get("image_base64") or body.get("image")
        if not image_base64:
            raise HTTPException(status_code=400, detail="Image data is required (file or image_base64).")
        
        # Approximate size of base64
        if len(image_base64) > (MAX_IMAGE_SIZE * 4 // 3):
            raise HTTPException(status_code=413, detail="Payload size exceeds the 5MB limit.")
            
        result = detect_faces_from_base64(image_base64, mock_mode=mock)
        if not result.success and result.error:
            raise HTTPException(status_code=400, detail=result.error)
        return result
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid request body or missing image.")

@router.post("/match-faces", response_model=MatchFacesResponse)
async def match_faces():
    return MatchFacesResponse(
        status="not_implemented",
        message="Face matching requires explicit student biometric consent workflows and security review. Not enabled in v1.",
        isMock=True
    )
