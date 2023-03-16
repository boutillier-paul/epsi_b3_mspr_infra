"""
    TEST RESGISTER
"""
import json

import pytest
import utils

@pytest.mark.order(100)
def test_sign_up():
    """
        test_sign_up
    """
    response = utils.client.post("/api/signup", content=json.dumps(utils.first_user.__dict__))
    print(response.json())
    assert response.status_code == 200
    assert response.json()['access_token'] is not None

@pytest.mark.order(101)    
def test_sign_up_bad_request():
    """
        test_sign_up_bad_request
    """
    response = utils.client.post("/api/signup", content=json.dumps(utils.first_user.__dict__))
    assert response.status_code == 400
    assert response.json() == {'detail': 'Email or Login already registered'}
