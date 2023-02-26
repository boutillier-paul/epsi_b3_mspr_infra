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


class Scenario_full_task(HttpUser):
    wait_time = between(1,10)
    
    # use string.hexdigits if whitespace not supported | printable
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
        
        me_response = client.get("/api/users/me", headers={"Authorization": f"Bearer {self.token}"})
        user_json = json.loads(me_response.json())
        self.user = schemas.User(**user_json)
        
        update_me_response = client.put("/api/users/me", headers={"Authorization": f"Bearer {self.token}"}, content=json.dumps(self.user_update.__dict__))
        
        
        # self.nbTrainer = len(self.client.get("trainers").json())

        # # Create first new player 
        # response = self.client.post("trainers/", json={"name": f"Red{self.nbTrainer+1}", "birthdate": "2022-11-11"})
        # self.id_trainer1 = response.json()["id"]

        # # Create second new player 
        # response = self.client.post("trainers/", json={"name": f"Blue{self.nbTrainer+2}", "birthdate": "2022-11-11"})
        # self.id_trainer2 = response.json()["id"]

        # # Add fisrt trainer a new pokemon
        # response = self.client.post("trainers/"+str(self.id_trainer1)+"/pokemon/", json={"api_id": self.api_id_pokemon1, "custom_name": "Ectoplasma"})

        # # Add second trainer a new pokemon
        # response = self.client.post("trainers/"+str(self.id_trainer2)+"/pokemon/", json={"api_id": self.api_id_pokemon2, "custom_name": "Nidoran"})

        # # Do a battle between both pokemons
        # response = self.client.get(f"pokemons/battle?first_poke_api_id={self.api_id_pokemon1}&second_poke_api_id={self.api_id_pokemon2}").json()
        pass