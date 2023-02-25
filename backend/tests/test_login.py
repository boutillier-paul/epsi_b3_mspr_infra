"""
    TEST LOGIN
"""
import json
import random
import string
from fastapi.testclient import TestClient
from main import app
from app import schemas

client = TestClient(app)

# use string.hexdigits if whitespace not supported
RANDOM_STR = ''.join(random.choices(string.printable ,k=12))
user = schemas.UserCreate(last_name=RANDOM_STR,
                                first_name=RANDOM_STR,
                                email=f"{RANDOM_STR}@gmail.com",
                                login=RANDOM_STR,
                                password=RANDOM_STR)
    
response = client.post("/api/signup", content=json.dumps(user.__dict__))
    
user_login = schemas.UserLogin(login=RANDOM_STR,
                                   password=RANDOM_STR)

def test_login():
    """
        test_login
    """
    response = client.post("/api/login", content=json.dumps(user_login.__dict__))
    
    assert response.status_code == 200
    assert response.json()['access_token'] is not None
    
def test_login_unauthorized():
    """
        test_login_unauthorized
    """
    bad_user_login = schemas.UserLogin(login='zzzzzzzzzzzzzzzzzz',
                                   password='zzzzzzzzzzzzzzzzzz')
    response = client.post("/api/login", content=json.dumps(bad_user_login.__dict__))
    
    assert response.status_code == 401
    assert response.json() == {'detail': 'Incorrect login or password'}