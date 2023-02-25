"""
    TEST PLANT
"""
import json
import random
import string
from fastapi.testclient import TestClient
from main import app
from app import schemas

client = TestClient(app)
USER_MDP ="Test_Plant#123"
USER_NAME="test_plant"

user_register = schemas.UserCreate(last_name=USER_NAME,
                                first_name=USER_NAME,
                                email=f"{USER_NAME}@gmail.com",
                                login=USER_NAME,
                                password=USER_MDP)

user_login = schemas.UserLogin(login=USER_NAME,
                                   password=USER_MDP)
RANDOM_STR = ''.join(random.choices(string.hexdigits ,k=12))

response = client.post("/api/login", content=json.dumps(user_login.__dict__))
if response.status_code != 200:
    response = client.post("/api/signup", content=json.dumps(user_register.__dict__))

token = response.json()['access_token']
response = client.get("/api/users/me", headers={"Authorization": f"Bearer {token}"})
user_id = response.json()['id']
plant_id = -1

plant = schemas.PlantCreate(name="test_plan",
                                species="test_plan",
                                photo=RANDOM_STR,
                                pos_lat=50.4,
                                pos_lng=3.4)

def test_create_plant():
    """
        def test_create_plant
    """
    
    response = client.post(f"/api/plants/", headers={"Authorization": f"Bearer {token}"}, content=json.dumps(plant.__dict__))
    response_json = response.json()
    
    assert response.status_code == 200
    assert response_json['name'] ==  plant.name\
        and response_json['species'] == plant.species\
            and response_json['photo'] == plant.photo\
                and response_json['pos_lat'] == plant.pos_lat\
                    and response_json['pos_lng'] == plant.pos_lng\
                        and response_json['pos_lng'] is not None

def test_read_plant():
    """
        test_read_plant
    """
    plant.photo = ''.join(random.choices(string.hexdigits ,k=12))
    response = client.post(f"/api/plants/", headers={"Authorization": f"Bearer {token}"}, content=json.dumps(plant.__dict__))
    plant_id = response.json()['id']
    
    response = client.get(f"/api/plants/{plant_id}", headers={"Authorization": f"Bearer {token}"})
    response_json = response.json()
    
    assert response.status_code == 200
    assert response_json is not None
    
def test_search_plant():
    """
        test_search_plant
    """
    response = client.get(f"/api/plants/search/{plant.name}", headers={"Authorization": f"Bearer {token}"})
    response_json = response.json()
    print(response_json)
    
    assert response.status_code == 200
    assert response_json is not None
    assert len(response_json) >= 1
    
def test_delete_plant():
    """
        test_delete_plant
    """
    plant.photo = ''.join(random.choices(string.hexdigits ,k=12))
    response = client.post(f"/api/plants/", headers={"Authorization": f"Bearer {token}"}, content=json.dumps(plant.__dict__))
    plant_id = response.json()['id']
    
    
    response = client.delete(f"/api/plants/{plant_id}", headers={"Authorization": f"Bearer {token}"})
    
    assert response.status_code == 200
    assert response.json() is not None

def test_delete_plant_not_found():
    """
        test_delete_plant
    """
    plant_id = 99999999
    response = client.delete(f"/api/plants/{plant_id}", headers={"Authorization": f"Bearer {token}"})
    
    assert response.status_code == 404
    assert response.json()['detail'] == 'Plant not found'
    
def test_delete_plant_unauthorized():
    """
        test_delete_plant
    """
    USER_NAME = ''.join(random.choices(string.hexdigits ,k=12))
    user_register = schemas.UserCreate(last_name=USER_NAME,
                                first_name=USER_NAME,
                                email=f"{USER_NAME}@gmail.com",
                                login=USER_NAME,
                                password=USER_MDP)
    plant = schemas.PlantCreate(name="test_plan",
                                species="test_plan",
                                photo=USER_NAME,
                                pos_lat=50.4,
                                pos_lng=3.4)
    response = client.post("/api/signup", content=json.dumps(user_register.__dict__))
    token2 = response.json()['access_token']
    response = client.post(f"/api/plants/", headers={"Authorization": f"Bearer {token2}"}, content=json.dumps(plant.__dict__))
    plant_id = response.json()['id']
    
    response = client.delete(f"/api/plants/{plant_id}", headers={"Authorization": f"Bearer {token}"})
    
    assert response.status_code == 401
    assert response.json()['detail'] == 'Unauthorized'
    