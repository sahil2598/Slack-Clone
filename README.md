# Slack Clone

This is a real-time chat application inspired by Slack, allowing users to send and read messages organized into Channels. Users can create accounts, log in, and participate in channel-based messaging with support for threaded replies.

## Features

- **Account Management**: Users can create accounts, log in, log out, change usernames, and passwords.
- **Channels**: Users can see a list of all channels, create new channels with unique names, and see the number of unread messages per channel.
- **Messaging**: Users can post messages, see threaded replies, and add emoji reactions. Messages display the number of replies and embedded images if URLs are detected.
- **Real-Time Updates**: Messages and unread counts are updated in real time. New messages are polled every 500 ms within a channel and every second across all channels.
- **Responsive UI**: Wide screen layout shows channels and messages side-by-side with a third column for threads. Narrow screens display one column at a time with easy navigation.
- **Navigation**: Users can navigate through channels and threads with the browser's back button and unique URLs. Authenticated state is preserved using localStorage or cookies.
- **Database**: SQLite3 database stores channels, messages, users, reactions, and read statuses. All inputs are sanitized with parameterized queries.
- **API**: Endpoints support user authentication, channel and message creation, and fetching unread message counts. All data-changing operations use POST requests.

## Technologies Used

- **Frontend**: React.Js
- **Backend**: Flask
- **Database**: SQLite3

## Instructions for Execution
1. Navigate to the project directory:
    ```bash
    cd belay
    ```
2. Run the Flask application:
    ```bash
    flask run
    ```