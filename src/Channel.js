import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createInit, getUser } from './GlobalMethods'

export default function Channel({ isNarrow }) {
    const { channel_id } = useParams();
    const navigate = useNavigate();
    const [channelName, setChannelName] = useState('');
    const [oldChannelName, setOldChannelName] = useState('');
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const imageUrlRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/gi;

    const getMessages = async () => {
        if (channel_id) {
            let user = await getUser();
            let url = `/api/channel/messages?channel_id=${channel_id}&user_id=${user.id}`;
            let response = await fetch(url, createInit('GET'));
            let responseJson = await response.json();
            setMessages(responseJson.messages);
        }
    }

    const postMessage = async () => {
        let user = await getUser()
        let request = { 'user_id': user['id'], 'channel_id': channel_id, 'message_body': newMessage }
        let response = await fetch('/api/channel/message', createInit('POST', request));
        setNewMessage('')
    }

    const fetchChannel = async () => {
        if (channel_id) {
            let url = `/api/channel?channel_id=${channel_id}`
            let response = await fetch(url, createInit('GET'));
            let channel = await response.json();
            console.log(channel.name);
            setChannelName(channel.name);
            setOldChannelName(channel.name)
        }
    }

    const toggleEdit = () => {
        setIsEditing(true);
    }

    const updateChannelName = async () => {
        let request = { 'channel_id': channel_id, 'channel_name': channelName };
        let response = await fetch('/api/channel/name', createInit('POST', request));
        if(!response.ok) {
            setChannelName(oldChannelName);
            alert('Room name already exists!');
        }
    }

    const addReaction = async (reaction, message_id) => {
        let user = await getUser()
        let request = { 'user_id': user.id, 'message_id': message_id, 'emoji': reaction }
        let response = await fetch('/api/message/reaction', createInit('POST', request));
    }

    const parseImageUrls = (text) => {
        return text.split(imageUrlRegex).map((part, index) => {
            if (part.match(imageUrlRegex)) {
                return <img key={index} src={part} alt="Embedded Image" />;
            } else {
                return <span key={index}>{part}</span>;
            }
        });
    };

    const redirectChannelList = () => {
        navigate('/')
    }

    useEffect(() => {
        fetchChannel();
        const intervalId = setInterval(getMessages, 500);
        return () => clearInterval(intervalId);
    }, [navigate]);

    return (
        <div class="chat">
            {isNarrow ? (
                <>
                    <button class="back-button" onClick={redirectChannelList}>Back</button>
                </>
            ) : (<></>)}
            {channel_id ? (
                <>
                    {isEditing ? (
                        <>
                            <input type="text" value={channelName} onChange={(e) => setChannelName(e.target.value)} />
                            <button class="chat-button" onClick={() => {
                                setOldChannelName(channelName)
                                updateChannelName()
                                setIsEditing(false);
                            }
                            }>Save</button>
                        </>
                    ) : (
                        <>
                            <h2>{channelName} <button class="chat-button" onClick={toggleEdit}> Edit</button></h2>
                        </>
                    )}
                    <ul class="messages">
                        {messages.map((msg, index) => (
                            <li key={index} class="message">
                                <span class="user">{msg.user_name}: </span>
                                <div className="message-content">
                                    {parseImageUrls(msg.body)}
                                </div>
                                {/* {parseImageUrls(msg.body)} */}
                                <ul>
                                    <li>
                                        <button class="reaction-button" onClick={() => addReaction('thumbsUp', msg.id)}>
                                            &#128077;
                                            {msg.reactions.thumbsUp.length == 0 ? (<></>) : (
                                                <>
                                                    <span class="tooltip-text">
                                                        {msg.reactions.thumbsUp.map((user, idx) => (
                                                            <p>{user}</p>
                                                        ))}
                                                    </span>
                                                </>
                                            )}
                                        </button>
                                        <button class="reaction-button" onClick={() => addReaction('laughingFace', msg.id)}>
                                            &#128514;
                                            {msg.reactions.laughingFace.length == 0 ? (<></>) : (
                                                <>
                                                    <span class="tooltip-text">
                                                        {msg.reactions.laughingFace.map((user, idx) => (
                                                            <p>{user}</p>
                                                        ))}
                                                    </span>
                                                </>
                                            )}
                                        </button>
                                        <button class="reaction-button" onClick={() => addReaction('heartEyes', msg.id)}>
                                            &#128525;
                                            {msg.reactions.heartEyes.length == 0 ? (<></>) : (
                                                <>
                                                    <span class="tooltip-text">
                                                        {msg.reactions.heartEyes.map((user, idx) => (
                                                            <p>{user}</p>
                                                        ))}
                                                    </span>
                                                </>
                                            )}
                                        </button>
                                        <button class="reaction-button" onClick={() => addReaction('cryingFace', msg.id)}>
                                            &#128557;
                                            {msg.reactions.cryingFace.length == 0 ? (<></>) : (
                                                <>
                                                    <span class="tooltip-text">
                                                        {msg.reactions.cryingFace.map((user, idx) => (
                                                            <p>{user}</p>
                                                        ))}
                                                    </span>
                                                </>
                                            )}
                                        </button>
                                    </li>
                                    {msg.replies.length == 0 ? (<></>) : (<li><b>{msg.replies.length} Replies</b></li>)}
                                    <li><Link to={`/channel/${channel_id}/${msg.id}`}>Add Reply</Link></li>
                                </ul>
                            </li>
                        ))}
                    </ul>
                    <form class="message-form">
                        <input type="text" placeholder="Post a new message" id="newMessage" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}/>
                        <button type="button" onClick={postMessage}>Post Message</button>
                    </form>
                </>
            ) : (<div></div>)}
        </div>
    );
}