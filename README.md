## Requirements

- As a user, I want to see the list of groups and users. So that I can start a chat with them.
- As a user, I want to know who is online, so that I can see who is available to chat.
- As a user, I want to see the historical messages, so that I can see the previous messages that I have received.
- As a user, I want to send a message to another user or a group of users, so that I can communicate with them.
- As a user, I want to see the messages that I have received in real-time manner, so that I can read them as soon as they are sent.

## Sending Message Flow

![Alt text](./images/MessageFlow.png)
[Link](https://app.diagrams.net/#G1xkIwGFyjLixf2YvwYbx7equgge-gv3Jr#%7B%22pageId%22%3A%22Z649WcYwynlIUiUDtifl%22%7D)

## Entities

- [User](#user)
- [Group](#group)
- [Message](#message)
- [ActiveUser](#activeuser)

### User

| Field      | Type   | Description                       |
| ---------- | ------ | --------------------------------- |
| user_id    | Number | Unique identifier for the user    |
| name       | String | Name of the user                  |
| created_at | String | Timestamp of the message creation |
| updated_at | String | Timestamp of the message update   |
| deleted_at | String | Timestamp of the message deletion |

### Group

| Field      | Type           | Description                       |
| ---------- | -------------- | --------------------------------- |
| group_id   | Number         | Unique identifier for the group   |
| name       | String         | Name of the group                 |
| user_ids   | List of Number | List of user ids in the group     |
| created_at | String         | Timestamp of the message creation |
| updated_at | String         | Timestamp of the message update   |
| deleted_at | String         | Timestamp of the message deletion |

### Message

| Field       | Type   | Description                       |
| ----------- | ------ | --------------------------------- |
| message_id  | Number | Unique identifier for the message |
| sender_id   | Number | User id of the sender             |
| receiver_id | Number | User id of the receiver           |
| group_id    | Number | Group id of the receiver          |
| content     | String | Content of the message            |
| created_at  | String | Timestamp of the message creation |
| updated_at  | String | Timestamp of the message update   |
| deleted_at  | String | Timestamp of the message deletion |

### ActiveUser

| Field   | Type   | Description                    |
| ------- | ------ | ------------------------------ |
| user_id | String | Unique identifier for the user |

## How to run the application

#### Backend side

Run kafka

```bash
export HOST_IP=$(ifconfig | grep -E "([0-9]{1,3}\.){3}[0-9]{1,3}" | grep -v 127.0.0.1 | awk '{ print $2 }' | cut -f2 -d: | head -n1)
docker-compose up
```

Run the backend

```bash
npm install
npm run start
```
