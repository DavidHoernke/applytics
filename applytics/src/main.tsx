import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="792999652360-eohokv8emn37rspc58chfdtra6en539v.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
