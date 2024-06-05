import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// import './index.css';
import { AuthContext } from './AuthContext';

export default function Logout() {
    const { setIsLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoggedIn(false);
        localStorage.removeItem('sahiln_belay_api_key');
        navigate('/login');
    }, []);

    return (
        <div>
        </div>
    );
}