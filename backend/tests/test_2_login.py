"""
    TEST LOGIN
"""
import pytest
import utils
import json
from app import schemas

@pytest.mark.order(3)
def test_login():
    """
        test_login
    """
    response = utils.client.post("/api/login", content=json.dumps(utils.first_user_login.__dict__))
    utils.token = response.json()['access_token']
    assert response.status_code == 200
    assert response.json()['access_token'] is not None

@pytest.mark.order(4)  
def test_login_unauthorized():
    """
        test_login_unauthorized
    """
    bad_user_login = schemas.UserLogin(login='zzzzzzzzzzzzzzzzzz',
                                   password='zzzzzzzzzzzzzzzzzz')
    response = utils.client.post("/api/login", content=json.dumps(bad_user_login.__dict__))
    
    assert response.status_code == 401
    assert response.json() == {'detail': 'Incorrect login or password'}