import React from 'react';
import WeatherCard from './WeatherCard';
import ForecastCard from './ForecastCard';
import HourlyForecast from './HourlyForecast';
import WeatherChart from './WeatherChart';
import WeatherAlert from './WeatherAlert';
import { User, Sparkles } from 'lucide-react';

export default function ChatMessage({ message }) {
  const isUser = message.sender === 'user';
  const { text, weatherData, intent, timestamp } = message;

  // Simple formatter for bold text and list bullets
  const renderFormattedText = (rawText) => {
    if (!rawText) return null;
    const lines = rawText.split('\n');

    return (
      <div className="space-y-1.5 leading-relaxed">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-1" />;

          // Process markdown bold (**text**)
          const parts = line.split(/(\*\*.*?\*\*)/g);
          const formattedLine = parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={pIdx} className="font-semibold text-emerald-700 dark:text-emerald-300">{part.slice(2, -2)}</strong>;
            }
            return part;
          });

          if (line.startsWith('• ') || line.startsWith('- ')) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span>{formattedLine}</span>
              </div>
            );
          }

          return <p key={idx}>{formattedLine}</p>;
        })}
      </div>
    );
  };

  return (
    <div className={`flex gap-3 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Avatar for Bot */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20 mt-1">
          <Sparkles className="w-4 h-4" />
        </div>
      )}

      <div className={`max-w-[88%] sm:max-w-[78%] ${isUser ? 'order-1' : 'order-2'}`}>
        {/* Chat Bubble Header */}
        <div className={`flex items-center gap-2 mb-1 text-[11px] font-semibold text-slate-400 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <span>{isUser ? 'You' : 'WeatherAI'}</span>
          <span>•</span>
          <span>{timestamp}</span>
        </div>

        {/* Bubble Box */}
        <div
          className={`p-4 rounded-2xl text-sm shadow-sm transition-all ${
            isUser
              ? 'bg-emerald-600 text-white rounded-tr-none'
              : 'bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-100 rounded-tl-none'
          }`}
        >
          {renderFormattedText(text)}
        </div>

        {/* Embedded Weather Cards & Graphs for Bot Messages */}
        {!isUser && weatherData && (
          <div className="mt-3 space-y-3 animate-fade-in">
            {/* Severe Alerts */}
            {weatherData.alerts && weatherData.alerts.length > 0 && (
              <WeatherAlert alerts={weatherData.alerts} />
            )}

            {/* Current Weather Card */}
            <WeatherCard weatherData={weatherData} />

            {/* Hourly Forecast */}
            {weatherData.hourly && weatherData.hourly.length > 0 && (
              <HourlyForecast hourlyData={weatherData.hourly} />
            )}

            {/* 5-Day Forecast if FORECAST intent */}
            {(intent === 'FORECAST' || intent === 'RAIN_FORECAST') && weatherData.daily && (
              <ForecastCard dailyData={weatherData.daily} />
            )}

            {/* Recharts Graphical Visualizations */}
            {weatherData.hourly && (
              <WeatherChart hourlyData={weatherData.hourly} />
            )}
          </div>
        )}
      </div>

      {/* Avatar for User */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 mt-1 order-2">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}
