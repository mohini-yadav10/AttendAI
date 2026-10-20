import os
import time
from fastapi import APIRouter, File, UploadFile, HTTPException, Request
from app.schemas.detection import (
    DetectionResponse, Base64ImageRequest, MatchFacesResponse,
    EngagementIngestRequest, SimulateSessionRequest
)
from app.services.detector import detect_faces_from_bytes, detect_faces_from_base64
from app.multimodal_agent import MultimodalAgent
from app.main_runner import AttendAICoreRunner

router = APIRouter(tags=["Detection & Multimodal Agent"])

MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5MB

# Shared MultimodalAgent instance for live session telemetry
global_agent = MultimodalAgent()

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

@router.post("/analyze-engagement")
async def analyze_engagement(payload: EngagementIngestRequest):
    """
    Milestone 4: Ingests vision + audio telemetry, computes multimodal engagement score.
    """
    ts = payload.timestamp if payload.timestamp is not None else time.time()
    signal = global_agent.ingest(
        student_id=payload.student_id,
        name=payload.name,
        timestamp=ts,
        presence_duration=payload.presence_duration,
        movement_score=payload.movement_score,
        speech_ratio=payload.speech_ratio,
        inactivity_duration=payload.inactivity_duration,
        attendance_status=payload.attendance_status
    )
    return {
        "success": True,
        "student_id": signal.student_id,
        "name": signal.name,
        "timestamp": signal.timestamp,
        "raw_engagement_score": signal.raw_engagement_score,
        "attendance_status": payload.attendance_status
    }

@router.get("/session-summary")
async def get_session_summary():
    """
    Milestone 5: Generates teaching suggestions and per-student session analytics.
    """
    return global_agent.get_session_summary()

@router.post("/simulate-session")
async def simulate_session(req: SimulateSessionRequest):
    """
    Milestone 6: Runs complete offline multimodal classroom intelligence pipeline.
    """
    runner = AttendAICoreRunner(
        video_source=0,
        audio_source="mock",
        output_dir="reports",
        mock_mode=True
    )
    result = runner.run_simulation_session(
        duration_seconds=req.duration_seconds,
        num_students=req.num_students
    )
    return {
        "success": True,
        "session_id": result["session_id"],
        "summary": result["summary"]
    }
