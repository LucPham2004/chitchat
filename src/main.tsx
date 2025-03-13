import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import App from './App';
import { ThemeProvider } from './utilities/ThemeContext';
import { AuthProvider } from './utilities/AuthContext';
import { ChatProvider } from './utilities/ChatContext';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <AuthProvider>
        <ThemeProvider>
          <ChatProvider>
            <App />
          </ChatProvider>
        </ThemeProvider>
      </AuthProvider>
    </StrictMode>
  );
} else {
  console.error('Failed to find the root element');
}
