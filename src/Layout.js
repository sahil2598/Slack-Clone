import Channel from "./Channel";
import ChannelList from "./ChannelList";
import Replies from './Replies'
import { useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';

export default function Layout() {
  const { channel_id, message_id } = useParams();
  const gridTemplateColumns = message_id ? "auto 250px 1fr 1fr" : "auto 250px 1fr";
  const navigate = useNavigate();
  const [isNarrow, setNarrow] = useState(window.innerWidth < 500);

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleLogoutClick = () => {
    navigate('/logout');
  };

  window.addEventListener('resize', () => {
    setNarrow(window.innerWidth < 768);
  });

  return (
    <div>
    {isNarrow ? (
      <>
        <div class="container" style={{ display: 'grid', gridTemplateColumns: "auto 1fr", height: '100vh' }}>
        <div class="sidebar-left">
          <div class="profile">
            <button onClick={handleProfileClick}>Profile</button>
            <button onClick={handleLogoutClick}>Logout</button>
          </div>
        </div>
        {message_id ? (
          <>
              <Replies />
          </>
        ) : (
          <>
          {channel_id ? (
            <>
              <Channel isNarrow={isNarrow}/>
            </>
          ) : (
            <>
              <ChannelList />
            </>
          )}
          </>
        )}
        </div>
      </>
        ) : (
      <>
      <div class="container" style={{ display: 'grid', gridTemplateColumns: gridTemplateColumns, height: '100vh' }}>
        <div class="sidebar-left">
          <div class="profile">
            <button onClick={handleProfileClick}>Profile</button>
            <button onClick={handleLogoutClick}>Logout</button>
          </div>
        </div>
        <ChannelList />
        <Channel />
        {message_id ? (
          <>
            <Replies />
          </>
        ) : (<></>)}
      </div>
      </>
    )}
    </div>
  )
};