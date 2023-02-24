from sqlalchemy.orm import Session
# from http import client
from fastapi.testclient import TestClient
from backend import app
from backend.app import schemas
client = TestClient(app)
import requests
import json
    
    
BASE_URL = 'http://0.0.0.0:80'
    
def test_create_user():
        # Arrange
        user = schemas.UserCreate(last_name="Doe", 
                                  first_name="Jhon",
                                  email="jhon.doe.999@gmail.com",
                                  login="JDoe999",
                                  password="pwd123")
        
        url_signup = BASE_URL + '/api/signup'
        rep = requests.post(url_signup, data = json.dumps(user.__dict__))
        token = rep.json()
        token = token['access_token'] 

        # Act
        url_current_user = BASE_URL + '/api/users/me'
        token = "Bearer "+token
        result = requests.get(url_current_user, headers={'Authorization': token} )

        # Assert
        result_json = result.json()
        assert result_json['last_name'] == user.last_name and result_json['first_name'] == user.first_name and result_json['email'] == user.email