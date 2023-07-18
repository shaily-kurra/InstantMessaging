import utils
from configurations import redis_connection
import time


def test_case_send_message(room_id,user_id):
    message = input("Enter the message")
    timestamp = time.time()
    utils.send_message(room_id,message,timestamp,user_id)

def test_case_create_room_id(user1, user2):
    response = utils.create_room_id(user1, user2)
    room_id = response[0]
    return room_id['id']

def test_case_get_message(room_id):
    results = utils.get_message(room_id)
    print(results)

def test_case_create_username(username):
    response = utils.create_user(username)
    return response['id']

if __name__ == "__main__":


    user1 = input("enter your name user 1")
    user2 = input("enter your name user 2")
    u1 = utils.get_userid(utils.make_username_key(user1))
    u2 = utils.get_userid(utils.make_username_key(user2))
    if u1 is None:
        user1 = test_case_create_username(user1)
    else:
        user1 = int(u1.decode("utf-8").split(":")[1])

    if u2 is None:
        user2 = test_case_create_username(user2)
    else:
        user2 = int(u2.decode("utf-8").split(":")[1])
    print(user1)
    print(user2)
    room_id = test_case_create_room_id(user1, user2)
    print(room_id)
    test_case_send_message(room_id,user1)
    test_case_get_message(room_id)


