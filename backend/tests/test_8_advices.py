"""
    TEST ADVICES
"""
import json
import pytest
import utils

@pytest.mark.order(800)
def test_create_advice():
    """
        test_create_advice
    """
    response = utils.client.post(f"/api/advices"
        , headers={"authorization":f"Bearer {utils.token}"}\
        , content = json.dumps(utils.first_advice.__dict__))
    response_json = response.json()
    utils.first_advice_id = response_json['id']
    
    assert response.status_code == 200
    assert response_json['title'] == utils.first_advice.title\
            and response_json['content'] == utils.first_advice.content\
                and response_json['photo'] == utils.first_advice.photo