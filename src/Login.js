import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// import './index.css';
import { AuthContext } from './AuthContext';
import { createInit } from './GlobalMethods'

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setIsLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = async () => {
        console.log('Inside handleLogin')
        let request = { 'username': username, 'password': password }
        let response = await fetch('/api/login', createInit('POST', request));
        let responseJson = await response.json();
        console.log(responseJson)
        if (response.ok) {
            setIsLoggedIn(true);
            localStorage.setItem('sahiln_belay_api_key', responseJson.api_key);
            navigate(location.state.from);  // null check
        } else {
            alert('Please enter valid username and password.');
        }
    }

    return (
        <div>
            <div class="login-form">
                <form>
                    <h1>Login</h1>
                    <label for="username">Username</label>
                    <input type="text" placeholder="Enter Username" id="username" onChange={(e) => setUsername(e.target.value)} />
                    <label for="password">Password</label>
                    <input type="password" placeholder="Enter Password" id="password" onChange={(e) => setPassword(e.target.value)} />
                    <button type="button" onClick={handleLogin}>Log in</button>
                </form>
                <p>Not registered? <a href="/signup">Create an account</a></p>
            </div>
        </div>
    );
}