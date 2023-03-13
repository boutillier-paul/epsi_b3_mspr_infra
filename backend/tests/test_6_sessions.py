"""
    TEST SESSIONS
"""
import pytest
import utils

@pytest.mark.order(600)
def test_read_session_unauthorized():
    """
        test_read_session_unauthorized
    """
    response = utils.client.get(f"/api/sessions/{99999999}"
        , headers={"authorization": f"Bearer {utils.token}"})
    response_json = response.json()
    
    assert response.status_code == 401
    assert response_json['detail'] == "You don't have access to this ressource"
    
# @pytest.mark.order() # TODO ADD ORDER
# def test_read_session():
#     """
#         test_read_session
#     """
#     response = utils.client.get(f"/api/sessions/{utils.first_session_id}"
#         , headers={"authorization": f"Bearer {utils.token}"})
#     response_json = response.json()
    
#     assert response.status_code == 200
#     assert response_json['id'] is not None