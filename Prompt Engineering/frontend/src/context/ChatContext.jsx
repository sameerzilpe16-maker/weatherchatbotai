import React, { createContext, useContext, useState, useEffect } from 'react';
import { sendChatMessage } from '../services/chatApi';
import { fetchForecast } from '../services/weatherApi';

const ChatContext = createContext();

const INITIAL_SAVED_LOCATIONS = ['Nagpur', 'Mumbai', 'Pune', 'Delhi'];

export function ChatProvider({ children }) {
  const [conversationId, setConversationId] = useState(() => `conv-${Date.now()}`);
  const [messages, setMessages] = useState([]);
  const [currentLocation, setCurrentLocation] = useState('Nagpur');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [isThinking, setIsThinking] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Saved locations
  const [savedLocations, setSavedLocations] = useState(() => {
    const saved = localStorage.getItem('weatherai_saved_locations');
    return saved ? JSON.parse(saved) : INITIAL_SAVED_LOCATIONS;
  });

  // Recent conversations list stored in localStorage
  const [recentChats, setRecentChats] = useState(() => {
    const saved = localStorage.getItem('weatherai_recent_chats');
    return saved ? JSON.parse(saved) : [];
  });

  // Save savedLocations to localStorage
  useEffect(() => {
    localStorage.setItem('weatherai_saved_locations', JSON.stringify(savedLocations));
  }, [savedLocations]);

  // Save recentChats to localStorage
  useEffect(() => {
    localStorage.setItem('weatherai_recent_chats', JSON.stringify(recentChats));
  }, [recentChats]);

  // Fetch initial default weather for default location
  useEffect(() => {
    loadWeatherData(currentLocation);
  }, []);

  const loadWeatherData = async (city) => {
    try {
      const data = await fetchForecast(city);
      if (data) {
        setCurrentWeather(data);
        if (data.location?.name) {
          setCurrentLocation(data.location.name);
        }
      }
    } catch (err) {
      console.warn('Error loading weather data:', err);
    }
  };

  const startNewChat = () => {
    const newId = `conv-${Date.now()}`;
    setConversationId(newId);
    setMessages([]);
    setIsThinking(false);
  };

  const addSavedLocation = (city) => {
    const formatted = city.trim();
    if (!formatted) return;
    if (!savedLocations.some(loc => loc.toLowerCase() === formatted.toLowerCase())) {
      setSavedLocations(prev => [...prev, formatted]);
    }
  };

  const removeSavedLocation = (city) => {
    setSavedLocations(prev => prev.filter(loc => loc.toLowerCase() !== city.toLowerCase()));
  };

  const sendMessage = async (text) => {
    if (!text || !text.trim() || isThinking) return;

    const userMessageText = text.trim();
    const userMsg = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: userMessageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);

    try {
      const response = await sendChatMessage(userMessageText, conversationId);

      const botMsg = {
        id: `msg-bot-${Date.now()}`,
        sender: 'bot',
        text: response.reply,
        intent: response.intent,
        timeframe: response.timeframe,
        location: response.location,
        weatherData: response.weatherData,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);

      if (response.location) {
        setCurrentLocation(response.location);
      }
      if (response.weatherData) {
        setCurrentWeather(response.weatherData);
      }

      // Record in recent chats list if first user message in this conversation
      setRecentChats(prev => {
        const existingIndex = prev.findIndex(item => item.id === conversationId);
        const title = userMessageText.length > 28 ? userMessageText.substring(0, 28) + '...' : userMessageText;
        const entry = {
          id: conversationId,
          title,
          location: response.location || currentLocation,
          timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        };

        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = entry;
          return updated;
        } else {
          return [entry, ...prev.slice(0, 15)];
        }
      });
    } catch (err) {
      console.error('Error sending message:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `msg-bot-err-${Date.now()}`,
          sender: 'bot',
          text: "Sorry, I couldn't find weather information for that request. Please check the city name and try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const selectRecentChat = (chatId) => {
    setConversationId(chatId);
    // In full implementation, we could restore message history per conversationId
  };

  return (
    <ChatContext.Provider
      value={{
        conversationId,
        messages,
        currentLocation,
        currentWeather,
        isThinking,
        isSidebarOpen,
        isSettingsOpen,
        savedLocations,
        recentChats,
        setIsSidebarOpen,
        setIsSettingsOpen,
        setCurrentLocation,
        startNewChat,
        sendMessage,
        addSavedLocation,
        removeSavedLocation,
        selectRecentChat,
        loadWeatherData
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within a ChatProvider');
  return context;
}
