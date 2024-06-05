# Belay: A Slack Clone

## Author
Sahil Nagpal

## Instructions for Execution
1. Navigate to the project directory:
    ```bash
    cd belay
    ```
2. Run the Flask application:
    ```bash
    flask run
    ```

## Important Notes
1. Unread messages displayed for a channel do not include replies.
2. The API to get the unread message count was not implemented separately. Instead, it is included in the `get_channels` API (`/api/channels`). This approach returns the unread counts for all channels together, reducing the number of requests to the server.
3. Similarly, the API to update the last message was not implemented separately. It is included in the `get_messages` API (`/api/channel/messages`) for simplicity.
4. The reply section displays the contents of the message to which it is replying.