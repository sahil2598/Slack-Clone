import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { AuthProvider } from './AuthContext';

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <App>
        <title>Belay</title>
      </App>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);