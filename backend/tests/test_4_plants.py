"""
    TEST PLANTS
"""
import json
import pytest
import utils

@pytest.mark.order(400) 
def test_create_plant():
    """
        def test_create_plant
    """
    response = utils.client.post(f"/api/plants/", headers={"authorization": f"Bearer {utils.token}"}\
        , content=json.dumps(utils.first_plant.__dict__))
    response_json = response.json()
    utils.fisrt_plant_id = response_json['id']
    
    assert response.status_code == 200
    assert response_json['name'] ==  utils.first_plant.name\
        and response_json['species'] == utils.first_plant.species\
            and response_json['photo'] == utils.first_plant.photo\
                and response_json['pos_lat'] == utils.first_plant.pos_lat\
                    and response_json['pos_lng'] == utils.first_plant.pos_lng
                        
@pytest.mark.order(401) 
def test_read_plant():
    """
        test_read_plant
    """
    response = utils.client.get(f"/api/plants/{utils.fisrt_plant_id}", headers={"authorization": f"Bearer {utils.token}"})
    response_json = response.json()
    
    assert response.status_code == 200
    assert response_json is not None
    
@pytest.mark.order(402) 
def test_search_plant():
    """
        test_search_plant
    """
    response = utils.client.get(f"/api/plants/search/{utils.first_plant.name}", headers={"authorization": f"Bearer {utils.token}"})
    response_json = response.json()
    print(response_json)
    
    assert response.status_code == 200
    assert response_json is not None
    assert len(response_json) >= 1

@pytest.mark.order(403)
def test_delete_plant():
    """
        test_delete_plant
    """
    response = utils.client.delete(f"/api/plants/{utils.fisrt_plant_id}", headers={"authorization": f"Bearer {utils.token}"})
    
    assert response.status_code == 200
    assert response.json() is not None

@pytest.mark.order(404)
def test_delete_plant_not_found():
    """
        test_delete_plant_not_found
    """
    plant_id = 99999999
    response = utils.client.delete(f"/api/plants/{plant_id}", headers={"authorization": f"Bearer {utils.token}"})
    
    assert response.status_code == 404
    assert response.json()['detail'] == 'Plant not found'

@pytest.mark.order(405)
def test_delete_plant_unauthorized():
    """
        test_delete_plant_unauthorized
    """
    response = utils.client.post("/api/signup", content=json.dumps(utils.second_user.__dict__))
    utils.second_token = response.json()['access_token']
    response = utils.client.get("/api/users/me", headers={"authorization": f"Bearer {utils.second_token}"})
    utils.second_user_id = response.json()['id']
    response = utils.client.post(f"/api/plants/", headers={"authorization": f"Bearer {utils.second_token}"}, content=json.dumps(utils.second_plant.__dict__))
    utils.second_plant_id = response.json()['id']
    
    response = utils.client.delete(f"/api/plants/{utils.second_plant_id}", headers={"authorization": f"Bearer {utils.token}"})
    
    assert response.status_code == 401
    assert response.json()['detail'] == 'Unauthorized'
    
@pytest.mark.order(406) 
def test_recreate_plant():
    """
        test_recreate_plant
    """
    response = utils.client.post(f"/api/plants/", headers={"authorization": f"Bearer {utils.token}"}\
        , content=json.dumps(utils.first_plant.__dict__))
    response_json = response.json()
    utils.fisrt_plant_id = response_json['id']
    
    assert response.status_code == 200
    assert response_json['name'] ==  utils.first_plant.name\
        and response_json['species'] == utils.first_plant.species\
            and response_json['photo'] == utils.first_plant.photo\
                and response_json['pos_lat'] == utils.first_plant.pos_lat\
                    and response_json['pos_lng'] == utils.first_plant.pos_lng
    