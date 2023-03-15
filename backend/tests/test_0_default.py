"""
    TEST DEFAULT
"""
import utils
import pytest


@pytest.mark.order(0)
def test_api_root():
    """
        test_api_root
    """
    response = utils.client.get("/api")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome on API root url"}
