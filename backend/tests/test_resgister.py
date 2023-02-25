"""
    TEST RESGISTER
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

def test_sign_up():
    """
        test_sign_up
    """
    response = client.post("/api/signup", content=json.dumps(user.__dict__))
    assert response.status_code == 200
    assert response.json()['access_token'] is not None
    
def test_sign_up_bad_request():
    """
        test_sign_up_bad_request
    """
    response = client.post("/api/signup", content=json.dumps(user.__dict__))
    assert response.status_code == 400
    assert response.json() == {'detail': 'Email or Login already registered'}
