import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { useTheme } from '../context/ThemeContext';
import {
  Plus,
  MessageSquare,
  MapPin,
  Settings,
  Sun,
  Moon,
  Trash2,
  X,
  PlusCircle,
  Sparkles,
  CloudSun
} from 'lucide-react';

export default function Sidebar() {
  const {
    startNewChat,
    recentChats,
    savedLocations,
    addSavedLocation,
    removeSavedLocation,
    selectRecentChat,
    sendMessage,
    isSidebarOpen,
    setIsSidebarOpen,
    setIsSettingsOpen
  } = useChat();

  const { isDarkMode, toggleDarkMode } = useTheme();

  const [newCityInput, setNewCityInput] = useState('');
  const [showAddCity, setShowAddCity] = useState(false);

  const handleAddCitySubmit = (e) => {
    e.preventDefault();
    if (newCityInput.trim()) {
      addSavedLocation(newCityInput.trim());
      setNewCityInput('');
      setShowAddCity(false);
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 select-none">
      {/* Brand Header */}
      <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
            <CloudSun className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white leading-tight">
              Weather<span className="text-emerald-500">AI</span>
            </h1>
            <p className="text-[10px] font-semibold text-slate-400 tracking-wide">
              INTELLIGENT ASSISTANT
            </p>
          </div>
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-4 pb-2">
        <button
          onClick={() => {
            startNewChat();
            setIsSidebarOpen(false);
          }}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm rounded-2xl shadow-md shadow-emerald-600/20 transition-all duration-200 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6 scrollbar-thin">
        {/* Recent Conversations */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            <span>Recent Conversations</span>
          </div>

          {recentChats.length === 0 ? (
            <p className="text-xs text-slate-400 italic px-2 py-1">No past chats yet</p>
          ) : (
            <div className="space-y-1">
              {recentChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => {
                    selectRecentChat(chat.id);
                    setIsSidebarOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 shrink-0" />
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                      {chat.title}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">{chat.timestamp}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Saved Locations */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            <span>Saved Locations</span>
            <button
              onClick={() => setShowAddCity(!showAddCity)}
              className="text-emerald-600 dark:text-emerald-400 hover:opacity-80 p-0.5"
              title="Add Location"
            >
              <PlusCircle className="w-4 h-4" />
            </button>
          </div>

          {showAddCity && (
            <form onSubmit={handleAddCitySubmit} className="flex gap-1.5 mb-2">
              <input
                type="text"
                placeholder="City name..."
                value={newCityInput}
                onChange={(e) => setNewCityInput(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500"
                autoFocus
              />
              <button
                type="submit"
                className="px-2 py-1 text-xs bg-emerald-600 text-white rounded-xl font-medium"
              >
                Add
              </button>
            </form>
          )}

          <div className="space-y-1">
            {savedLocations.map((city) => (
              <div
                key={city}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 group"
              >
                <button
                  onClick={() => {
                    sendMessage(`What is the weather in ${city}?`);
                    setIsSidebarOpen(false);
                  }}
                  className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex-1 text-left"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{city}</span>
                </button>

                <button
                  onClick={() => removeSavedLocation(city)}
                  className="p-1 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove location"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
        {/* Dark/Light Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            {isDarkMode ? <Moon className="w-4 h-4 text-sky-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-normal">Toggle</span>
        </button>

        {/* Settings Button */}
        <button
          onClick={() => {
            setIsSettingsOpen(true);
            setIsSidebarOpen(false);
          }}
          className="w-full flex items-center gap-2 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
        >
          <Settings className="w-4 h-4 text-slate-500" />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed Left) */}
      <aside className="hidden md:block w-72 h-screen shrink-0 sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 transition-opacity"
        />
      )}

      {/* Mobile Drawer (Slide in) */}
      <div
        className={`md:hidden fixed inset-y-0 left-0 w-72 z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
}
