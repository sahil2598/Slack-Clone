from flask import *
import sqlite3
import random, string

app = Flask(__name__, static_folder='build', static_url_path='')

def get_db():
    db = getattr(g, '_database', None)

    if db is None:
        db = g._database = sqlite3.connect('db/belay.sqlite3')
        db.row_factory = sqlite3.Row
        setattr(g, '_database', db)
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def query_db(query, args=(), one=False):
    db = get_db()
    cursor = db.execute(query, args)
    rows = cursor.fetchall()
    db.commit()
    cursor.close()
    if rows:
        if one: 
            return rows[0]
        return rows
    return None

@app.route('/')
@app.route('/login')
@app.route('/signup')
@app.route('/profile')
@app.route('/logout')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/channel/<int:id>')
def channel_index(id):
    return index()


@app.route('/api/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    user = query_db('SELECT * from Users WHERE name = ? and password = ?', [username, password], one=True)
    if user:
        return {'api_key': user['api_key']}, 200
    else:
        return {'Message': 'Error'}, 403

def new_user(name, password):
    api_key = ''.join(random.choices(string.ascii_lowercase + string.digits, k=40))
    u = query_db('INSERT INTO Users (name, password, api_key) ' + 
        'values (?, ?, ?) RETURNING id, name, password, api_key',
        (name, password, api_key),
        one=True)
    return u

@app.route('/api/signup', methods=['POST'])
def signup():
    username = request.json.get('username')
    password = request.json.get('password')
    duplicate_user = query_db('SELECT * from Users WHERE name = ?', [username])
    if duplicate_user:
        return {'message': 'Duplicate username'}, 409

    user = new_user(username, password)
    response = {'api_key': user['api_key'], 'user_id': user['id'], 'user_name': user['name'], 'password' : user['password']}
    return response, 200

@app.route('/api/channels', methods=['GET'])
def get_channels():
    channels = query_db('SELECT C.id, C.name, COUNT(M.id) AS count FROM Channels as C LEFT JOIN Messages as M ON C.id = M.channel_id WHERE M.reply_to IS NULL GROUP BY C.id, C.name ORDER BY C.id')
    channels_list = []
    if not channels:
        return {'channels': []}, 200
    
    channels_dict = dict()

    for channel in channels:
        channels_dict[channel['id']] = {'id': channel['id'], 'name': channel['name'], 'unread_count': channel['count']}

    user_id = request.args.get('user_id')
    latest_channel_messages = query_db('SELECT channel_id, last_message_id FROM LastViewed WHERE user_id = ?', [user_id])

    if not latest_channel_messages:
        response = {'channels': list(channels_dict.values())}
        return response, 200
    
    for msg in latest_channel_messages:
        channel_id = msg[0]
        latest_id = msg[1]
        channel_messages = query_db('SELECT id FROM Messages WHERE channel_id = ? AND reply_to IS NULL ORDER BY id', [channel_id])
        message_list = [channel_msg[0] for channel_msg in channel_messages]
        channels_dict[channel_id]['unread_count'] = len(message_list) - message_list.index(latest_id) - 1

    response = {'channels': list(channels_dict.values())}
    return response, 200

def set_latest_message(user_id, channel_id, last_message_id):
    query = 'INSERT OR REPLACE INTO LastViewed (user_id, channel_id, last_message_id) VALUES (?, ?, ?)'
    query_db(query, [user_id, channel_id, last_message_id])

@app.route('/api/channel/messages', methods=['GET'])
def get_messages():
    query = 'SELECT M.id, U.name, M.body, M.reply_to FROM Messages as M INNER JOIN Users as U ON M.user_id=U.id where M.channel_id = ? order by M.id'
    channel_id = request.args.get('channel_id')
    response = query_db(query, [channel_id])
    messages = {'messages': []}
    if not response:
        return messages, 200
    
    messages_dict = dict()
    latest_msg_id = -1
    for msg in response:
        if not msg[3]:
            latest_msg_id = msg[0]
            messages_dict[msg[0]] = {'id': msg[0], 'user_name': msg[1], 'body': msg[2], 'replies': [], 'reactions': {
                'thumbsUp': [], 'laughingFace': [], 'heartEyes': [], 'cryingFace': []}}
        else:
            messages_dict[msg[3]]['replies'].append({'id': msg[0], 'user_name': msg[1], 'body': msg[2]})

    reactions_query = 'SELECT R.message_id, R.emoji, U.name FROM Reactions AS R INNER JOIN Users AS U ON R.user_id = U.id INNER JOIN Messages as M on R.message_id = M.id WHERE M.channel_id = ?'
    reactions = query_db(reactions_query, [channel_id])

    if not reactions:
        messages['messages'] = list(messages_dict.values())
        user_id = request.args.get('user_id')
        set_latest_message(user_id, channel_id, latest_msg_id)
        return messages, 200

    for reaction in reactions:
        messages_dict[reaction[0]]['reactions'][reaction[1]].append(reaction[2])

    messages['messages'] = list(messages_dict.values())

    user_id = request.args.get('user_id')
    set_latest_message(user_id, channel_id, latest_msg_id)

    return messages, 200

@app.route('/api/channel/message', methods=['GET'])
def get_message():
    message_id = request.args.get('message_id')
    message = query_db('SELECT id, body from Messages WHERE id = ?', [message_id], one=True)
    return {'id': message[0], 'body': message[1]}, 200

@app.route('/api/user/name', methods=['POST'])
def update_username():
    query = 'UPDATE Users SET name = ? WHERE api_key = ?'
    new_username = request.json.get('username')

    duplicate_user = query_db('SELECT * from Users WHERE name = ?', [new_username])
    if duplicate_user:
        return {'message': 'Duplicate username'}, 409

    api_key = request.headers.get('API-KEY')
    db_run = query_db(query, [new_username, api_key])
    return {'response': 'Success'}, 200

# POST to change the user's password
@app.route('/api/user/password', methods=['POST'])
def update_password():
    query = 'UPDATE Users SET password = ? WHERE api_key = ?'
    new_password = request.json.get('password')
    api_key = request.headers.get('API-KEY')
    return {'response': 'Success'}, 200

@app.route('/api/user/api_key', methods=['GET'])
def get_user_from_api_key():
    api_key = request.headers.get('API-KEY')
    user = query_db('SELECT * from Users WHERE api_key = ?', [api_key], one=True)
    return {'id': user['id'], 'name': user['name'], 'password': user['password']}, 200

@app.route('/api/channel/message', methods=['POST'])
def post_message():
    query = 'INSERT INTO Messages (user_id, channel_id, body) VALUES (?, ?, ?)'
    room_id = request.json.get('channel_id')
    comment_body = request.json.get('message_body')
    user_id = request.json.get('user_id')
    db_run = query_db(query, [user_id, room_id, comment_body])
    return {}, 200

@app.route('/api/message/reply', methods=['POST'])
def post_reply():
    query = 'INSERT INTO Messages (user_id, channel_id, reply_to, body) VALUES (?, ?, ?, ?)'
    user_id = request.json.get('user_id')
    channel_id = request.json.get('channel_id')
    reply_to = request.json.get('reply_to')
    reply_body = request.json.get('reply_body')
    db_run = query_db(query, [user_id, channel_id, reply_to, reply_body])
    return {}, 200

@app.route('/api/channel/create', methods=['POST'])
def create_channel():
    name = request.json.get('channel_name')
    duplicate_channel = query_db('SELECT * from Channels WHERE name = ?', [name])
    if duplicate_channel:
        return {'message': 'Duplicate channel name'}, 409
    room = query_db('INSERT INTO Channels (name) VALUES (?) returning id', [name], one=True)
    return {'id': room['id']}, 200 

@app.route('/api/channel', methods=['GET'])
def get_channel():
    channel_id = request.args.get('channel_id')
    channel = query_db('SELECT * from Channels WHERE id = ?', [channel_id], one=True)
    return {'id': channel[0], 'name': channel[1]}, 200

@app.route('/api/channel/name', methods=['POST'])
def update_channel_name():
    query = 'UPDATE Channels SET name = ? WHERE id = ?'
    channel_id = request.json.get('channel_id')
    channel_name = request.json.get('channel_name')
    duplicate_channel = query_db('SELECT * from Channels WHERE name = ?', [channel_name])
    if duplicate_channel:
        return {'message': 'Duplicate channel name'}, 409
    
    db_run = query_db(query, [channel_name, channel_id])
    return {'response': 'Success'}, 200

@app.route('/api/message/reaction', methods=['POST'])
def add_reaction():
    user_id = request.json.get('user_id')
    message_id = request.json.get('message_id')
    emoji = request.json.get('emoji')
    query_db('INSERT OR IGNORE INTO Reactions (user_id, message_id, emoji) VALUES (?, ?, ?)', [user_id, message_id, emoji])
    return {'response': 'Success'}, 200

@app.route('/api/channel/replies', methods=['GET'])
def get_replies():
    message_id = request.args.get('message_id')
    replies = query_db('SELECT M.id, U.name, M.body FROM Messages as M INNER JOIN Users as U ON M.user_id = U.id WHERE M.reply_to = ?', [message_id])
    response = {'replies': []}

    if not replies:
        return response, 200

    for reply in replies:
        response['replies'].append({'id': reply[0], 'user_name': reply[1], 'body': reply[2]})

    return response, 200