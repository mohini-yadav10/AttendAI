import pytest

@pytest.mark.asyncio
async def test_health_endpoint(client):
    response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "attendai-ai"
    assert "mock_mode" in data

@pytest.mark.asyncio
async def test_detect_faces_no_input(client):
    response = await client.post("/detect-faces", json={})
    assert response.status_code in [400, 422]

@pytest.mark.asyncio
async def test_detect_faces_valid_base64(client):
    # Minimal 1x1 pixel base64 GIF / JPEG
    dummy_base64 = "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
    response = await client.post("/detect-faces", json={"image_base64": dummy_base64})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["is_mock"] is True
    assert "faces" in data
    assert len(data["faces"]) > 0

@pytest.mark.asyncio
async def test_detect_faces_invalid_base64(client):
    response = await client.post("/detect-faces", json={"image_base64": "!!!not_valid_base64!!!"})
    # Since mock mode is active, it may succeed with mock data or fail with 400
    assert response.status_code in [200, 400]

@pytest.mark.asyncio
async def test_detect_faces_too_large(client):
    large_payload = "A" * (7 * 1024 * 1024)  # > 5MB
    response = await client.post("/detect-faces", json={"image_base64": large_payload})
    assert response.status_code == 413

@pytest.mark.asyncio
async def test_match_faces_returns_not_implemented(client):
    response = await client.post("/match-faces")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "not_implemented"
    assert data["isMock"] is True
    assert "biometric" in data["message"].lower() or "consent" in data["message"].lower()

@pytest.mark.asyncio
async def test_mock_disclaimer_present(client):
    dummy_base64 = "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
    response = await client.post("/detect-faces", json={"image_base64": dummy_base64})
    assert response.status_code == 200
    data = response.json()
    assert "mock_disclaimer" in data
    assert data["mock_disclaimer"] is not None

@pytest.mark.asyncio
async def test_analyze_engagement_endpoint(client):
    payload = {
        "student_id": 99,
        "name": "Test Student",
        "presence_duration": 45.0,
        "movement_score": 0.8,
        "speech_ratio": 0.3,
        "inactivity_duration": 5.0,
        "attendance_status": "present"
    }
    response = await client.post("/analyze-engagement", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["student_id"] == 99
    assert 0.0 <= data["raw_engagement_score"] <= 1.0

@pytest.mark.asyncio
async def test_session_summary_endpoint(client):
    response = await client.get("/session-summary")
    assert response.status_code == 200
    data = response.json()
    assert "total_students_tracked" in data
    assert "student_analytics" in data
    assert "teaching_suggestions" in data

@pytest.mark.asyncio
async def test_simulate_session_endpoint(client):
    payload = {"duration_seconds": 3, "num_students": 2}
    response = await client.post("/simulate-session", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "session_id" in data
    assert "summary" in data
