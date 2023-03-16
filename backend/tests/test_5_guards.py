"""
    TEST GUARDS
"""
import json
import pytest
import utils

@pytest.mark.order(500) 
def test_create_guard():
    """
        test_create_guard
    """
    response = utils.client.post(f"/api/guards?plant_id={utils.fisrt_plant_id}"
        , headers={"authorization": f"Bearer {utils.token}"}\
        , content=json.dumps(utils.fisrt_guard))
    response_json = response.json()
    utils.fisrt_guard_id = response_json['id']
    
    assert response.status_code == 200
    assert response_json['start_at'] ==  utils.fisrt_guard['start_at']\
        and response_json['end_at'] == utils.fisrt_guard['end_at']
        
@pytest.mark.order(501)
def test_create_guard_plant_not_owned():
    """
        test_create_guard_plant_not_owned
    """
    response = utils.client.post(f"/api/guards?plant_id={utils.second_plant_id}"
        , headers={"authorization": f"Bearer {utils.token}"}\
        , content=json.dumps(utils.fisrt_guard))
    
    response_json = response.json()
    
    assert response.status_code == 400
    assert response_json['detail'] == 'You can only create guard for your plants'
    
@pytest.mark.order(502)
def test_read_guard():
    """
        test_read_guard
    """
    response = utils.client.get(f"/api/guards/{utils.fisrt_guard_id}"
        , headers={"authorization": f"Bearer {utils.token}"})
    response_json = response.json()
    print(response_json)
    
    assert response.status_code == 200
    assert response_json['start_at'] ==  utils.fisrt_guard['start_at']\
        and response_json['end_at'] == utils.fisrt_guard['end_at']
        
@pytest.mark.order(503)
def test_read_guard_not_found():
    """
        test_read_guard_not_found
    """
    response = utils.client.get(f"/api/guards/{999999999}"
        , headers={"authorization": f"Bearer {utils.token}"})
    response_json = response.json()
    
    assert response.status_code == 404
    assert response_json['detail'] ==  'Guard not found'
    
@pytest.mark.order(504) 
def test_create_second_guard():
    """
        test_create_second_guard
    """
    response = utils.client.post(f"/api/guards?plant_id={utils.second_plant_id}"
        , headers={"authorization": f"Bearer {utils.second_token}"}\
        , content=json.dumps(utils.fisrt_guard))
    response_json = response.json()
    utils.second_guard_id = response_json['id']
    
    assert response.status_code == 200
    assert response_json['start_at'] ==  utils.fisrt_guard['start_at']\
        and response_json['end_at'] == utils.fisrt_guard['end_at']
    
@pytest.mark.order(505)
def test_read_guard_unauthorized():
    """
        test_read_guard_unauthorized
    """
    response = utils.client.get(f"/api/guards/{utils.second_guard_id}"
        , headers={"authorization": f"Bearer {utils.token}"})
    response_json = response.json()
    
    assert response.status_code == 401
    assert response_json['detail'] ==  'Unauthorized'
    
@pytest.mark.order(506)
def test_delete_guard_didnt_create():
    """
        test_delete_guard_didnt_create
    """
    response = utils.client.delete(f"/api/guards/{utils.second_guard_id}"
        , headers={"authorization": f"Bearer {utils.token}"})
    response_json = response.json()
    
    assert response.status_code == 401
    assert response_json['detail'] == "You didn't created that guard"
    
@pytest.mark.order(507)
def test_delete_guard():
    """
        test_delete_guard
    """
    response = utils.client.delete(f"/api/guards/{utils.second_guard_id}"
        , headers={"authorization": f"Bearer {utils.second_token}"})
    response_json = response.json()
    
    assert response.status_code == 200
    assert response_json['start_at'] ==  utils.fisrt_guard['start_at']\
        and response_json['end_at'] == utils.fisrt_guard['end_at']


