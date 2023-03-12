"""
    TEST UNIT REGISTRY / LGOIN
"""

# from sqlalchemy.orm import Session
# from http import client
# from fastapi.testclient import TestClient
# from backend import app
import json
import random
import string
import requests
from backend.app import schemas
# client = TestClient(app)


BASE_URL = 'http://0.0.0.0:80'

RANDOM_STR = ''.join(random.choices(string.ascii_lowercase, k=12))

TIMEOUT = 60

def test_signup():
    """
        test_signup
    """
    
    # Arrange
    user = schemas.UserCreate(last_name=RANDOM_STR,
                                first_name=RANDOM_STR,
                                email=f"{RANDOM_STR}@gmail.com",
                                login=RANDOM_STR,
                                password=RANDOM_STR)

    url_signup = BASE_URL + '/api/signup'
    rep = requests.post(url_signup, data = json.dumps(user.__dict__), timeout=TIMEOUT)
    token = rep.json()
    token = token['access_token']

    # Act
    url_current_user = BASE_URL + '/api/users/me'
    token = "Bearer "+token
    result = requests.get(url_current_user, headers={'authorization': token}, timeout=TIMEOUT)
    result_json = result.json()

    # Assert
    assert result_json['last_name'] == user.last_name\
        and result_json['first_name'] == user.first_name\
            and result_json['email'] == user.email\
                and result_json['id'] is not None

def test_login():
    """
        test_login
    """
    # Arrange
    user_login = schemas.UserLogin(login=RANDOM_STR,
                                   password=RANDOM_STR)

    # Act
    url_signup = BASE_URL + '/api/login'
    rep = requests.post(url_signup, data =  json.dumps(user_login.__dict__), timeout=TIMEOUT)
    token = rep.json()
    token = token['access_token']

    # Assert
    assert token is not None
    