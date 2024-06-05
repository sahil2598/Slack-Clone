import React, { useState, useContext } from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Login from './Login'
import Signup from './Signup'
import { AuthContext } from './AuthContext';
import ChannelList from './ChannelList';
import Channel from './Channel'
import Profile from './Profile'
import Logout from './Logout';

export default function App() {
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
    console.log(isLoggedIn)
    return (
        <BrowserRouter>
            <Routes>
                {
                    isLoggedIn ? (
                        <>
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/logout" element={<Logout />}></Route>
                            <Route path="/" element={<Layout />} />
                            <Route path="/login" element={<Layout />} />
                            <Route path="/signup" element={<Layout />} />
                            <Route path="/channel/:channel_id" element={<Layout />} />
                            <Route path="/channel/:channel_id/:message_id" element={<Layout />} />
                        </>
                    ) : (
                        <>
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/*" element={<Login />} />
                        </>
                    )}

            </Routes>
        </BrowserRouter>
    );
}