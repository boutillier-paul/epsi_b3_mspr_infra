"""
    LOCUSTFILE
"""
from main import app
from app import schemas
import json
import random
import string
from locust import HttpUser, between, task
from fastapi.testclient import TestClient


client = TestClient(app)


class Scenario_full_User(HttpUser):
    wait_time = between(1,10)
    
    RANDOM_STR = ''.join(random.choices(string.hexdigits ,k=12))

    user_register = schemas.UserCreate(last_name=RANDOM_STR,
                                first_name=RANDOM_STR,
                                email=f"{RANDOM_STR}@gmail.com",
                                login=RANDOM_STR,
                                password=RANDOM_STR)

    user_login = schemas.UserLogin(login=RANDOM_STR, password=RANDOM_STR)
    
    user_update = schemas.UserUpdate(last_name="John",
                                first_name="Dhoe",
                                email=f"{RANDOM_STR}@updated.fr")
    user = schemas.User
    token: str
    
    @task
    def index(self):
        
        signup_response = client.post("/api/signup", content=json.dumps(self.user_register.__dict__))
        login_response = client.post("/api/login", content=json.dumps(self.user_login.__dict__))
        
        self.token = login_response.json()['access_token']
        
        me_response = client.get("/api/users/me", headers={"authorization": f"Bearer {self.token}"})
        user_json = json.loads(me_response.json())
        self.user = schemas.User(**user_json)
        
        update_me_response = client.put("/api/users/me", headers={"authorization": f"Bearer {self.token}"}, content=json.dumps(self.user_update.__dict__))