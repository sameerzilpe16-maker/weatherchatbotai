import React, { useState } from 'react';
import { X, Settings, Key, Cpu, Trash2, Check } from 'lucide-react';
import Button from './UI/Button';

export default function SettingsModal({ isOpen, onClose }) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('weatherai_custom_weather_key') || '');
  const [aiKey, setAiKey] = useState(() => localStorage.getItem('weatherai_custom_ai_key') || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (apiKey) localStorage.setItem('weatherai_custom_weather_key', apiKey.trim());
    if (aiKey) localStorage.setItem('weatherai_custom_ai_key', aiKey.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all stored recent conversations?')) {
      localStorage.removeItem('weatherai_recent_chats');
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-700 pb-3">
          <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-100">
            <Settings className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>WeatherAI Settings</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <Key className="w-4 h-4 text-emerald-500" />
              OpenWeatherMap API Key
            </label>
            <input
              type="password"
              placeholder="Paste custom OpenWeather API key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Leave blank to use the backend server's default / mock fallback engine.
            </p>
          </div>

          <div>
            <label className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <Cpu className="w-4 h-4 text-sky-500" />
              Gemini / AI API Key
            </label>
            <input
              type="password"
              placeholder="Paste custom Gemini/AI key..."
              value={aiKey}
              onChange={(e) => setAiKey(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:border-sky-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Leave blank to use the built-in natural language rule engine.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <button
              type="button"
              onClick={handleClearHistory}
              className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 hover:underline"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Recent Chats
            </button>

            <Button type="submit" variant="primary" size="sm">
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  Saved!
                </>
              ) : (
                'Save Settings'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
