CREATE TABLE Users (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name VARCHAR(40),
	password VARCHAR(40),
	api_key VARCHAR(40)
)

CREATE TABLE Channels (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name VARCHAR(40)
)

CREATE TABLE Messages (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	user_id INTEGER,
	channel_id INTEGER,
	reply_to INTEGER,
	body TEXT,
	FOREIGN KEY (user_id) REFERENCES Users(id),
	FOREIGN KEY (channel_id) REFERENCES Channels(id),
	FOREIGN KEY (reply_to) REFERENCES Messages(id)
)


CREATE TABLE Reactions (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	user_id INTEGER,
	message_id INTEGER,
	emoji TEXT,
	FOREIGN KEY (user_id) REFERENCES Users(id),
	FOREIGN KEY (message_id) REFERENCES Messages(id)
)

CREATE TABLE LastViewed (
	user_id INTEGER,
	channel_id INTEGER, 
    last_message_id INTEGER,
    PRIMARY KEY (user_id, channel_id),
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (channel_id) REFERENCES Channels(id),
    FOREIGN KEY (last_message_id) REFERENCES Messages(id)
)