import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createInit } from './GlobalMethods'

export default function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('')
    const navigate = useNavigate();

    const handleSignup = async () => {
        if (password !== repeatPassword) {
            alert('Passwords do not match.');
            return;
        }

        let request = { 'username': username, 'password': password };
        let response = await fetch('/api/signup', createInit('POST', request));
        let responseJson = await response.json();
        if (response.ok) {
            alert('Signup successful. Please login.');
            navigate('/login');
        } else {
            alert('Username already exists!');
        }
    }

    return (
        <div>
            <div class="background">
            </div>
            <div class="login-form">
                <form>
                    <h1>Signup</h1>
                    <label for="username">Username</label>
                    <input
                        type="text"
                        placeholder="Username"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label for="password">Password</label>
                    <input
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label for="password">Repeat Password</label>
                    <input
                        type="password"
                        placeholder="Repeat Password"
                        onChange={(e) => setRepeatPassword(e.target.value)}
                    />
                    <button type="button" onClick={handleSignup}>Sign up</button>
                </form>
            </div>
        </div>
    );
}