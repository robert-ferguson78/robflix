import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import { AuthProvider } from './contexts/authContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './css/style.css';

// Create a client
const queryClient = new QueryClient();

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container!); // Create a root.

root.render(
  // make the authentication context and query client available to all components within App
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);