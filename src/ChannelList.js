import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createInit, getUser } from './GlobalMethods'

export default function ChannelList() {
    const { channel_id } = useParams()
    const navigate = useNavigate();
    const [channels, setChannels] = useState([]);
    const [newChannel, setNewChannel] = useState('');

    const getChannels = async () => {
        let user = await getUser()
        let url = `/api/channels?user_id=${user.id}`
        let response = await fetch(url, createInit('GET'))
        let responseJson = await response.json();
        setChannels(responseJson.channels);
    }

    const createChannel = async () => {
        console.log('Inside createChannel')
        let request = { 'channel_name': newChannel }
        let response = await fetch('/api/channel/create', createInit('POST', request))
        if (!response.ok)
            alert('Duplicate channel name entered.')
        setNewChannel('')
    }

    useEffect(() => {
        const intervalId = setInterval(getChannels, 1000);
        return () => clearInterval(intervalId);
    }, [navigate]);

    return (
        <div class="channels">
            <h2>Channels</h2>
            <ul class="channel-list">
                {channels.map((channel, index) => (
                    <li key={index} class={channel.id == channel_id ? 'highlighted' : ''}>
                        <Link to={`/channel/${channel.id}`}>
                            <b>{channel.name}</b>
                            <div className="message-content">
                                <i>{channel.unread_count} unread messages</i>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
            <form class="message-form">
                <input type="text" placeholder="Enter new room name" id="newChannel" value={newChannel} onChange={(e) => setNewChannel(e.target.value)} />
                <button type="button" onClick={createChannel}>Create New Channel</button>
            </form>
        </div>
    );
}