"""
    TEST MESSAGES 
"""
import utils
import json
import pytest

@pytest.mark.order()
def test_create_message():
    """
        test_create_message
    """
    response = utils.client.post(f"/api/messages/{utils.second_user_id}"
        , headers={"authorization":f"Bearer {utils.token}"}\
        , content = json.dumps(utils.first_message.__dict__))
    response_json = response.json()
    utils.fisrt_message_id = response_json['id']
    
    assert response.status_code == 200
    assert response_json['content'] == utils.first_message.content\
            and response_json['reciever_id'] == utils.second_user_id
            
@pytest.mark.order()
def test_create_message_no_reciever():
    """
        test_create_message_no_reciever
    """
    response = utils.client.post(f"/api/messages/{99999999}"
        , headers={"authorization":f"Bearer {utils.token}"}\
        , content = json.dumps(utils.first_message.__dict__))
    response_json = response.json()
    
    assert response.status_code == 400
    assert response_json['detail'] == "reciever doesn't exist"


@pytest.mark.order()
def test_read_messages_conversation():
    """
        test_read_messages_conversation
    """
    response = utils.client.get(f"/api/messages/{utils.second_user_id}"
        , headers={"authorization":f"Bearer {utils.token}"})
    response_json = response.json()
    
    assert response.status_code == 200
    assert response_json is not None
    
@pytest.mark.order()
def test_read_messages_conversation_no_interlocutor():
    """
        test_read_messages_conversation_no_interlocutor
    """
    response = utils.client.get(f"/api/messages/{999999999}"
        , headers={"authorization":f"Bearer {utils.token}"})
    response_json = response.json()
    
    assert response.status_code == 400
    assert response_json['detail'] == "Interlocutor doesn't exist"