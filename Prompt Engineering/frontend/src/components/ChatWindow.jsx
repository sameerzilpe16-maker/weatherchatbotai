import React, { useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import WelcomeScreen from './WelcomeScreen';
import { Menu, MapPin, Sparkles, RefreshCw } from 'lucide-react';

export default function ChatWindow() {
  const {
    messages,
    isThinking,
    currentLocation,
    setIsSidebarOpen,
    sendMessage,
    loadWeatherData,
    currentWeather
  } = useChat();

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  return (
    <div className="flex-1 flex flex-col h-screen min-w-0 bg-slate-50 dark:bg-slate-900 relative">
      {/* Header Bar */}
      <header className="px-4 py-3 bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>WeatherAI</span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                PRO
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Your intelligent weather assistant
            </p>
          </div>
        </div>

        {/* Location Indicator & Refresh */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-2xs">
            <MapPin className="w-3.5 h-3.5 text-emerald-500 animate-bounce-slow" />
            <span>{currentLocation}</span>
            {currentWeather?.current && (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold ml-1">
                {currentWeather.current.temp}°C
              </span>
            )}
          </div>

          <button
            onClick={() => loadWeatherData(currentLocation)}
            className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Refresh weather data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Messages Scroll Area */}
      <main className="flex-1 overflow-y-auto px-4 py-6 max-w-4xl w-full mx-auto space-y-4">
        {messages.length === 0 ? (
          <WelcomeScreen onSelectPrompt={(prompt) => sendMessage(prompt)} />
        ) : (
          messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))
        )}

        {/* Typing Indicator */}
        {isThinking && (
          <div className="flex items-center gap-3 my-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3.5 rounded-2xl rounded-tl-none bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <span>Checking the latest weather & thinking...</span>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Bottom Input Area */}
      <ChatInput onSendMessage={sendMessage} isThinking={isThinking} />
    </div>
  );
}
