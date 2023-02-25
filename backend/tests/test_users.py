"""
    TEST USERS
"""
import json
import random
import string
from fastapi.testclient import TestClient
from main import app
from app import schemas

client = TestClient(app)

# use string.hexdigits if whitespace not supported
RANDOM_STR = ''.join(random.choices(string.hexdigits ,k=12))
user = schemas.UserCreate(last_name=RANDOM_STR,
                                first_name=RANDOM_STR,
                                email=f"{RANDOM_STR}@gmail.com",
                                login=RANDOM_STR,
                                password=RANDOM_STR)
    
response = client.post("/api/signup", content=json.dumps(user.__dict__))
token = response.json()['access_token']
response = client.get("/api/users/me", headers={"Authorization": f"Bearer {token}"})
user_id = response.json()['id']

# get /users/me
def test_get_current_user():
    """
        test_login
    """
    response = client.get("/api/users/me", headers={"Authorization": f"Bearer {token}"})
    response_json = response.json()
    
    assert response.status_code == 200
    assert response_json['last_name'] == user.last_name\
        and response_json['first_name'] == user.first_name\
            and response_json['email'] == user.email\
                and response_json['id'] is not None
    
def test_get_current_unauthorized():
    """
        test_get_current_unauthorized
    """
    response = client.get("/api/users/me", headers={})
    
    assert response.status_code == 401
    assert response.json() == {'detail': 'Unauthorized'}
    
# get /users/{user_id}
def test_read_user():
    """
        test_read_user
    """
    response = client.get(f"/api/users/{user_id}", headers={"Authorization": f"Bearer {token}"})
    response_json = response.json()
    
    assert response.status_code == 200
    assert response_json['last_name'] == user.last_name\
        and response_json['first_name'] == user.first_name\
            and response_json['email'] == user.email\
                and response_json['id'] is not None

def test_read_user_not_found():
    """
        test_read_user_not_found
    """
    response = client.get(f"/api/users/999999999", headers={"Authorization": f"Bearer {token}"})
    
    assert response.status_code == 404
    assert response.json() == {'detail': 'User not found'}
    
# post /users/me
def test_update_user():
    """
        test_update_user
    """
    user_update = schemas.UserUpdate(last_name="John",
                                first_name="Dhoe",
                                email=f"{RANDOM_STR}@updated.fr")
    
    response = client.put("/api/users/me", headers={"Authorization": f"Bearer {token}"}, content=json.dumps(user_update.__dict__))
    response_json = response.json()
    print(response.json())
    
    assert response.status_code == 200
    assert response_json['last_name'] == user_update.last_name\
        and response_json['first_name'] == user_update.first_name\
            and response_json['email'] == user_update.email\
                and response_json['id'] == user_id

    

    
