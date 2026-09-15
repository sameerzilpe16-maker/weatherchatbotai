import React from 'react';
import { Sun, CloudRain, Thermometer, Calendar, Plane, Sparkles } from 'lucide-react';

export default function WelcomeScreen({ onSelectPrompt }) {
  const suggestions = [
    {
      icon: <Sun className="w-4 h-4 text-amber-500" />,
      title: "Today's Overview",
      prompt: "What's the weather today in Nagpur?"
    },
    {
      icon: <CloudRain className="w-4 h-4 text-sky-500" />,
      title: "Rain Forecast",
      prompt: "Will it rain tomorrow in Mumbai?"
    },
    {
      icon: <Thermometer className="w-4 h-4 text-rose-500" />,
      title: "Temperature Check",
      prompt: "What is the temperature in Delhi?"
    },
    {
      icon: <Calendar className="w-4 h-4 text-emerald-500" />,
      title: "5-Day Forecast",
      prompt: "Give me the 5-day forecast for Pune."
    },
    {
      icon: <Plane className="w-4 h-4 text-indigo-500" />,
      title: "Travel & Activities",
      prompt: "Is it a good day for travel in Bangalore?"
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-8 text-center max-w-2xl mx-auto">
      {/* Brand Icon / Logo */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-4 shadow-xl shadow-emerald-500/20 mb-6 flex items-center justify-center animate-pulse-subtle">
        <Sparkles className="w-10 h-10 text-white" />
      </div>

      <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
        How can I help you with the weather?
      </h1>
      <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-md mb-8">
        Ask questions in plain English about current conditions, rain forecasts, travel advice, or outdoor activities.
      </p>

      {/* Suggestion Chips Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
        {suggestions.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(item.prompt)}
            className="flex items-center gap-3 p-3.5 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl text-left hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-md transition-all duration-200 group cursor-pointer"
          >
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700/60 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/50 transition-colors">
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {item.title}
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                "{item.prompt}"
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
