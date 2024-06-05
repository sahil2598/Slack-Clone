import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createInit, getUser } from './GlobalMethods'

export default function Replies() {
    const { channel_id, message_id } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState('')
    const [replies, setReplies] = useState([]);
    const [newReply, setNewReply] = useState('')
    const imageUrlRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/gi;

    const getReplies = async () => {
        let user = getUser();
        let url = `/api/channel/replies?message_id=${message_id}`;
        let response = await fetch(url, createInit('GET'));
        let responseJson = await response.json();
        setReplies(responseJson.replies);
    }

    const postReply = async () => {
        let user = await getUser()
        let request = { 'user_id': user.id, 'channel_id': channel_id, 'reply_to': message_id, 'reply_body': newReply };
        let response = await fetch('/api/message/reply', createInit('POST', request));
        setNewReply('')
    }

    const dismissReplies = () => {
        navigate(`/channel/${channel_id}`)
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

    const fetchMessage = async () => {
        let url = `/api/channel/message?message_id=${message_id}`
        let request = {'message_id': message_id}
        let response = await fetch(url, createInit('GET'));
        let message = await response.json();
        console.log(message.body)
        setMessage(message.body);
    }

    useEffect(() => {
        fetchMessage();
        const intervalId = setInterval(getReplies, 500);
        return () => clearInterval(intervalId);
    }, [navigate]);

    return (
        <div class="replies">
            {channel_id ? (
                <>
                    <button class="back-button" onClick={dismissReplies}>Back</button>
                    <h2>Replies</h2>
                    <p>Replying to "{message}"</p>
                    <ul class="messages">
                        {replies.map((reply, index) => (
                            <li key={index} class="message">
                                <span class="user">{reply.user_name}: </span>
                                <div className="message-content">
                                    {parseImageUrls(reply.body)}
                                </div>
                            </li>
                        ))}
                    </ul>
                    <form class="message-form">
                        <input type="text" placeholder="Post a new reply" id="newReply" value={newReply} onChange={(e) => setNewReply(e.target.value)} />
                        <button type="button" onClick={postReply}>Post Reply</button>
                    </form>
                </>
            ) : (<div></div>)}
        </div>
    );
}