import os
from datetime import datetime, timezone
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.routes.detection import router as detection_router

load_dotenv()

MOCK_MODE = os.getenv("AI_MOCK_MODE", "true").lower() in ("true", "1", "yes")

app = FastAPI(
    title="AttendAI AI Service",
    description="Computer vision and face detection microservice for AttendAI classroom attendance platform.",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include detection endpoints
app.include_router(detection_router)

@app.get("/health")
async def health_check():
    mock = os.getenv("AI_MOCK_MODE", "true").lower() in ("true", "1", "yes")
    return {
        "status": "ok",
        "service": "attendai-ai",
        "version": "1.0.0",
        "mock_mode": mock,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "note": "Mock mode active — all detection results are simulated." if mock else "Real OpenCV detection active."
    }

if __name__ == "__main__":
    import uvicorn
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app.main:app", host=host, port=port, reload=True)
