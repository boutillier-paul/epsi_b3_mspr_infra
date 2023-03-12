"""
    TEST USERS
"""
import json

import pytest
import utils
from app import schemas

# get /users/me
@pytest.mark.order(5)  
def test_get_current_user():
    """
        test_login
    """
    response = utils.client.get("/api/users/me", headers={"authorization": f"Bearer {utils.token}"})
    response_json = response.json()
    utils.first_user_id = response_json['id']
    
    assert response.status_code == 200
    assert response_json['last_name'] == utils.first_user.last_name\
        and response_json['first_name'] == utils.first_user.first_name\
            and response_json['email'] == utils.first_user.email\
                and response_json['id'] is not None

@pytest.mark.order(6)  
def test_get_current_unauthorized():
    """
        test_get_current_unauthorized
    """
    response = utils.client.get("/api/users/me", headers={})
    
    assert response.status_code == 401
    assert response.json() == {'detail': 'Unauthorized'}
    
# get /users/{user_id}
@pytest.mark.order(6)  
def test_read_user():
    """
        test_read_user
    """
    response = utils.client.get(f"/api/users/{utils.first_user_id}", headers={"authorization": f"Bearer {utils.token}"})
    response_json = response.json()
    
    assert response.status_code == 200
    assert response_json['last_name'] == utils.first_user.last_name\
        and response_json['first_name'] == utils.first_user.first_name\
            and response_json['email'] == utils.first_user.email\
                and response_json['id'] is not None

@pytest.mark.order(7)  
def test_read_user_not_found():
    """
        test_read_user_not_found
    """
    response = utils.client.get(f"/api/users/999999999", headers={"authorization": f"Bearer {utils.token}"})
    
    assert response.status_code == 404
    assert response.json() == {'detail': 'User not found'}
    
# post /users/me
@pytest.mark.order(8)  
def test_update_user():
    """
        test_update_user
    """
    response = utils.client.put("/api/users/me"
        , headers={"authorization": f"Bearer {utils.token}"}
        , content=json.dumps(utils.first_user_update.__dict__))
    response_json = response.json()
    
    assert response.status_code == 200
    assert response_json['id'] == utils.first_user_id\
        and response_json['last_name'] == utils.first_user_update.last_name\
            and response_json['first_name'] == utils.first_user_update.first_name\
                and response_json['email'] == utils.first_user_update.email\
                
@pytest.mark.order(9) 
def test_update_user_invalid_email():
    """
        test_update_user_invalid_email
    """
    wrong_email_user = utils.first_user_update
    wrong_email_user.email = "invalid_email"
    response = utils.client.put("/api/users/me"
        , headers={"authorization": f"Bearer {utils.token}"}
        , content=json.dumps(wrong_email_user.__dict__))
    response_json = response.json()
    
    assert response.status_code == 400
    assert response_json['detail'] == 'Invalid email format'
                


    

    
