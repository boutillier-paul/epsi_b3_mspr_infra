"""
    UTILS
"""
import datetime
import random
import string
from fastapi.testclient import TestClient
from main import app
from app import schemas

# Client
global client
client = TestClient(app)

# Users
global RANDOM_STR 
RANDOM_STR = ''.join(random.choices(string.hexdigits ,k=12))

global SECOND_RANDOM_STR
SECOND_RANDOM_STR = ''.join(random.choices(string.hexdigits ,k=12))

global first_user 
first_user = schemas.UserCreate(last_name=RANDOM_STR,
                                first_name=RANDOM_STR,
                                email=f"{RANDOM_STR}@gmail.com",
                                login=RANDOM_STR,
                                password=RANDOM_STR)

global token

global first_user_login
first_user_login = schemas.UserLogin(login=RANDOM_STR,
                                   password=RANDOM_STR)

global first_user_id

global first_user_update 
first_user_update = schemas.UserUpdate(last_name="John",
                                first_name="Dhoe",
                                email=f"{RANDOM_STR}@updated.fr")

global second_user
second_user = schemas.UserCreate(last_name=SECOND_RANDOM_STR,
                                first_name=SECOND_RANDOM_STR,
                                email=f"{SECOND_RANDOM_STR}@gmail.com",
                                login=SECOND_RANDOM_STR,
                                password=SECOND_RANDOM_STR)

global second_user_id

global second_token

# Plants

global first_plant
first_plant = schemas.PlantCreate(name="test_plan",
                                species="test_plan",
                                photo=RANDOM_STR,
                                pos_lat=50.4,
                                pos_lng=3.4)

global fisrt_plant_id 
fisrt_plant_id = -1

global second_plant
second_plant = schemas.PlantCreate(name=f"test_plant_{SECOND_RANDOM_STR}",
                                species="test_plant",
                                photo=SECOND_RANDOM_STR,
                                pos_lat=50.4,
                                pos_lng=3.4)

global second_plant_id 
second_plant_id = -1

# GUARDS

global fisrt_guard
fisrt_guard = {
    "start_at": datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S.%f"),
    "end_at": (datetime.datetime.now() + datetime.timedelta(days=7)).strftime("%Y-%m-%dT%H:%M:%S.%f")
}

global fisrt_guard_id
fisrt_guard_id = -1


#MESSAGES

global message_id
message_id = -1

global first_message
first_message = schemas.MessageCreate(
                                       content=RANDOM_STR,
                                       sender_id = f"{first_user}",
                                       reciever_id = f"{second_user}",
                                       created_at= datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S.%f")
)