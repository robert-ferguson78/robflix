import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import { AuthProvider } from './contexts/authContext';

ReactDOM.render(
  <React.StrictMode>
    {/* make the authentication context available to all components within App */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);