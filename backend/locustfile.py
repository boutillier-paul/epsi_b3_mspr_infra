"""
    LOCUSTFILE
"""
import datetime
from main import app
from app import schemas
import json
import random
import string
from locust import HttpUser, between, task
from fastapi.testclient import TestClient


class Scenario_full_User(HttpUser):
    wait_time = between(1,3)
    
    @task
    def index(self):
        # Users
        RANDOM_STR = ''.join(random.choices(string.hexdigits ,k=12))
        FIRST_PASSWORD = RANDOM_STR + "@ZERty123"

        SECOND_RANDOM_STR = ''.join(random.choices(string.hexdigits ,k=12))
        SECOND_PASSWORD = SECOND_RANDOM_STR + "@ZERty123"

        first_user = schemas.UserCreate(last_name=RANDOM_STR,
                                        first_name=RANDOM_STR,
                                        email=f"{RANDOM_STR}.{RANDOM_STR}@gmail.com",
                                        login=RANDOM_STR,
                                        password=FIRST_PASSWORD)

        token : str
        
        first_user_login = schemas.UserLogin(login=RANDOM_STR,
                                        password=FIRST_PASSWORD)

        first_user_id = -1

        first_user_update = schemas.UserUpdate(last_name="Dhoe",
                                        first_name="John",
                                        email=f"{RANDOM_STR}@updated.fr")

        second_user = schemas.UserCreate(last_name=SECOND_RANDOM_STR,
                                        first_name=SECOND_RANDOM_STR,
                                        email=f"{SECOND_RANDOM_STR}.{SECOND_RANDOM_STR}@gmail.com",
                                        login=SECOND_RANDOM_STR,
                                        password=SECOND_PASSWORD)
        
        second_user_login = schemas.UserLogin(login=SECOND_RANDOM_STR,
                                        password=SECOND_PASSWORD)

        second_user_id = -1

        second_token: str

        # Plants

        first_plant = schemas.PlantCreate(name="test_plan",
                                        species="test_plan",
                                        photo=RANDOM_STR,
                                        pos_lat=50.4,
                                        pos_lng=3.4)

        fisrt_plant_id = -1

        second_plant = schemas.PlantCreate(name=f"test_plant_{SECOND_RANDOM_STR}",
                                        species="test_plant",
                                        photo=SECOND_RANDOM_STR,
                                        pos_lat=50.4,
                                        pos_lng=3.4)

        second_plant_id = -1

        # GUARDS

        fisrt_guard = {
            "start_at": datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S.%f"),
            "end_at": (datetime.datetime.now() + datetime.timedelta(days=7)).strftime("%Y-%m-%dT%H:%M:%S.%f")
        }

        fisrt_guard_id = -1
        second_guard_id = -1

        # MESSAGES

        first_message = schemas.MessageCreate(
            content=RANDOM_STR,
        )

        empty_message = schemas.MessageCreate

        first_message_id = -1

        # ADVICES

        first_advice = schemas.AdviceCreate(
            title=RANDOM_STR,
            content=RANDOM_STR,
            photo=RANDOM_STR,
        )

        first_advice_id = -1
        
        first_signup_response = self.client.post("/api/signup", data=json.dumps(first_user.__dict__))
        first_login_response = self.client.post("/api/login", data=json.dumps(first_user_login.__dict__))
        
        second_signup_response = self.client.post("/api/signup", data=json.dumps(second_user.__dict__))
        second_login_response = self.client.post("/api/login", data=json.dumps(second_user_login.__dict__))
        
        self.token = first_login_response.json()['access_token']
        self.second_token = second_login_response.json()['access_token']
        
        first_me = self.client.get("/api/users/me", headers={"authorization": f"Bearer {token}"})
        self.first_user_id = first_me.json()['id']
        second_me = self.client.get("/api/users/me", headers={"authorization": f"Bearer {second_token}"})
        self.second_user_id = second_me.json()['id']
        
        first_me_updated = self.client.put("/api/users/me", headers={"authorization": f"Bearer {token}"}, data=json.dumps(first_user_update.__dict__))
        
        self.client.put(f"/api/users/{second_user_id}/botanist", headers={"authorization": f"Bearer {second_token}"})
        
        first_plant_create_response = self.client.post(f"/api/plants/", headers={"authorization": f"Bearer {token}"}\
            , data=json.dumps(first_plant.__dict__))
        first_plant_create_response_json = first_plant_create_response.json()
        self.fisrt_plant_id = first_plant_create_response_json['id']
        
        second_plant_create_response = self.client.post(f"/api/plants/", headers={"authorization": f"Bearer {second_token}"}\
            , data=json.dumps(second_plant.__dict__))
        second_plant_create_response_json = second_plant_create_response.json()
        self.second_plant_id = second_plant_create_response_json['id']
        
        first_guard_create = self.client.post(f"/api/guards?plant_id={fisrt_plant_id}"
            , headers={"authorization": f"Bearer {token}"}\
            , data=json.dumps(fisrt_guard))
        first_guard_create_json = first_guard_create.json()
        self.fisrt_guard_id = first_guard_create_json['id']
        
        self.client.put(f"/api/guards/{fisrt_guard_id}/take", headers={"authorization": f"Bearer {second_token}"})
        
        first_guard_create = self.client.post(f"/api/advices", headers={"authorization": f"Bearer {second_token}"}\
            , data=json.dumps(first_advice.__dict__))
        

        
        
        
        
        
        