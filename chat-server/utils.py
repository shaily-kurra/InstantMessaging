from configurations import redis_connection
import json
import math

def send_message(room_id, message, timestamp, userid, sender, receiver):
    content = {
        "user_details": userid,
        "message": message,
        "timestamp": timestamp,
        "room_details": room_id,
        "sender": sender,
        "receiver": receiver
    }
    payload = json.dumps(content)
    time = int(timestamp)
    redis_connection.zadd(room_id, {payload: time})

def check_user_exist(username):
    if redis_connection.exists(username):
        return True
    return False

def get_userid(username_key):
    user_exist = redis_connection.exists(username_key)
    if user_exist:
        return redis_connection.get(username_key)
    return None

def make_username_key(username):
    return f"username:{username}"

def decode(userid):
    return int(userid.decode("utf-8").split(":")[1])

def create_user(username):
    username_key = make_username_key(username)
    next_id = redis_connection.incr("total_users")
    user_key = f"user:{next_id}"
    redis_connection.set(username_key, user_key)
    redis_connection.sadd(f"user:{next_id}:rooms", "0")
    return {"id": next_id, "username": username}


def get_message(room_id=0, offset=0, size=50):
    room_key = f"room:{room_id}"
    room_exists = redis_connection.exists(room_id)
    if room_exists:
        values = redis_connection.zrevrange(room_id, offset, offset + size)
        return list(map(lambda x: json.loads(x.decode("utf-8")), values))
    return None


def get_friend_list(userid, username):
    friends_list_id = redis_connection.zrevrange(userid, 0, -1)
    friends_list = redis_connection.zrevrange(username, 0, -1)
    friends_list_id = list(map(lambda x: json.loads(x.decode("utf-8")), friends_list_id))
    friends_list = list(map(lambda x: x.decode("utf-8"), friends_list))
    return friends_list_id, friends_list

def add_to_friends_list(userid1, userid2, user1, user2):
    redis_connection.zadd(userid1, {userid2: 1})
    redis_connection.zadd(userid2, {userid1: 1})
    redis_connection.zadd(user1, {user2: 1})
    redis_connection.zadd(user2, {user1: 1})

def get_room_id(user1, user2):
    if math.isnan(user1) or math.isnan(user2) or user1 == user2:
        return None
    min_user_id = user2 if user1 > user2 else user1
    max_user_id = user1 if user1 > user2 else user2
    return f"{min_user_id}:{max_user_id}"


def create_room_id(user1, user2):
    """Create a private room and add users to it"""
    room_id = get_room_id(user1, user2)
    if not room_id:
        return None, True

    # Add rooms to those users
    redis_connection.sadd(f"user:{user1}:rooms", room_id)
    redis_connection.sadd(f"user:{user2}:rooms", room_id)
    return (
        {
            "id": room_id,
            "names": [user1, user2],
        },
        False,
    )
