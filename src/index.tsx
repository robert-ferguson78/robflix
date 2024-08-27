import ReactDOM from 'react-dom/client';
import App from './app';
import { AuthProvider } from './contexts/authContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './css/style.css';

// Create a new QueryClient instance
const queryClient = new QueryClient();

const container = document.getElementById('root'); // Get the root container element
const root = ReactDOM.createRoot(container!); // Create a root for React rendering

// Render the application
root.render(
  <QueryClientProvider client={queryClient}> {/* Provide the QueryClient to the app */}
    <AuthProvider> {/* Provide the Auth context to the app */}
      <App /> {/* Render the main App component */}
    </AuthProvider>
  </QueryClientProvider>
);