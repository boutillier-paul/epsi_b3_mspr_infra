"""
    TEST DEFAULT
"""
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_api_root():
    """
        test_api_root
    """
    response = client.get("/api")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome on API root url"}
