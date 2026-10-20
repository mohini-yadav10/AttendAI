from pydantic import BaseModel, Field
from typing import Optional, List

class BoundingBox(BaseModel):
    x: int
    y: int
    width: int
    height: int
    confidence: float = Field(default=1.0, ge=0.0, le=1.0)

class DetectionResponse(BaseModel):
    success: bool
    face_count: int
    faces: List[BoundingBox]
    processing_time_ms: float
    is_mock: bool
    mock_disclaimer: Optional[str] = None
    image_width: Optional[int] = None
    image_height: Optional[int] = None
    error: Optional[str] = None

class Base64ImageRequest(BaseModel):
    image_base64: str

class MatchFacesResponse(BaseModel):
    status: str
    message: str
    isMock: bool
