"""
    TEST GUARDS
"""
import json
import pytest
import utils

@pytest.mark.order(17) 
def test_create_guard():
    """
        def test_create_guard
    """
    response = utils.client.post(f"/api/guards?plant_id={utils.fisrt_plant_id}"
        , headers={"authorization": f"Bearer {utils.token}"}\
        , content=json.dumps(utils.fisrt_guard))
    response_json = response.json()
    print(response_json)
    utils.fisrt_guard_id = response_json['id']
    
    assert response.status_code == 200
    assert response_json['start_at'] ==  utils.fisrt_guard['start_at']\
        and response_json['end_at'] == utils.fisrt_guard['end_at']
        
@pytest.mark.order(18)
def test_create_guard_plant_not_owned():
    """
        def test_create_guard_plant_not_owned
    """
    response = utils.client.post(f"/api/guards?plant_id={utils.second_plant_id}"
        , headers={"authorization": f"Bearer {utils.token}"}\
        , content=json.dumps(utils.fisrt_guard))
    
    response_json = response.json()
    
    assert response.status_code == 400
    assert response_json['detail'] == 'You can only create guard for your plants'
    
    

