"""
    TEST MESSAGES 
"""
from email import utils
import json
import pytest

#je n'ai pas mis d'ordre vu qu'il y aura d'autres test avant celui-ci
@pytest.mark.order()
def test_create_message():
    response = utils.message.post(f"/api/messages/", headers={"authorization":f"Bearer{utils.token}"}\
       , content = json.dumps(utils.first_message.__dict__))
    response_json = response.json()
    utils.first_message_id = response_json['id']
    
    assert response.status_code == 200
    assert response_json['content'] == utils.first_content\
        and response_json['sender_id'] == utils.first_sender_id\
            and response_json['reciever_id'] == utils.first_reciever_id\
                and response_json['created_at'] == utils.first_created_at


#@pytest.mark.order()
#def test_read_message():
    # """
    #     TEST READ MESSAGE

    # """
    # re





@pytest.mark.order()
def test_delete_message():
    """
        TEST DELETE MESSAGES
    """
    response = utils.message.delete(f"/api/messages/{utils.first_message_id}", headers={"authorization": f"Bearer {utils.token}"})
    
    assert response.status_code == 200
    assert response.json() is not None

