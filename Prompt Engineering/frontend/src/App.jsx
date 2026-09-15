import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ChatProvider } from './context/ChatContext';
import Home from './pages/Home';

export default function App() {
  return (
    <ThemeProvider>
      <ChatProvider>
        <Home />
      </ChatProvider>
    </ThemeProvider>
  );
}
