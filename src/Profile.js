import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createInit, getUser } from './GlobalMethods';

export default function Profile() {
    const [username, setUsername] = useState('');
    const [oldUsername, setOldUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const navigate = useNavigate();

    const changeUsername = async () => {
        let request = { 'username': username };
        let response = await fetch('/api/user/name', createInit('POST', request));
        if (response.ok)
            alert('Username updated successfully!');
        else {
            setUsername(oldUsername);
            alert('Username already exists!');
        }
    }

    const changePassword = async () => {
        if (password != repeatPassword) {
            alert('Passwords do not match!')
            return;
        }

        let request = { 'password': password }
        let response = await fetch('/api/user/password', createInit('POST', request));
        if (response.ok)
            alert('Password updated successfully')
    }

    const homeRedirect = () => {
        navigate('/')
    }

    const getUserDetails = async() => {
        let user = await getUser()
        setUsername(user.name);
        setOldUsername(user.name);
        setPassword(user.password);
        setRepeatPassword(user.password);
    }

    useEffect(() => {
        getUserDetails()
    }, []);

    return (
        <div>
            <div class="login-form">
                <form>
                    <button class="chat-button" onClick={homeRedirect}>Back</button>
                    <h1>User Profile</h1>
                    <label for="username">Username</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <button type="button" onClick={() => {
                        setOldUsername(username)
                        changeUsername()
                    }} >Change Username</button>
                    <label for="password">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <label for="repeatPassword">Repeat Password</label>
                    <input type="password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} />
                    <button type="button" onClick={changePassword} >Change Password</button>
                </form>
            </div>
        </div>
    );
}