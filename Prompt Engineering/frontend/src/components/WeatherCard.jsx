import React from 'react';
import WeatherIcon from './UI/WeatherIcon';
import {
  Droplets,
  Wind,
  Eye,
  Sun,
  Sunset,
  Sunrise,
  Compass,
  Gauge,
  CloudRain
} from 'lucide-react';

export default function WeatherCard({ weatherData, compact = false }) {
  if (!weatherData || !weatherData.current) return null;

  const { location, current } = weatherData;

  // Determine dynamic accent styling based on condition
  const getConditionGradient = () => {
    const cond = (current.condition || '').toLowerCase();
    if (cond.includes('rain') || cond.includes('storm')) {
      return 'from-slate-900/90 to-sky-900/90 text-white';
    }
    if (cond.includes('cloud')) {
      return 'from-slate-800/80 to-teal-900/80 text-white';
    }
    return 'from-emerald-700/90 to-teal-800/90 text-white';
  };

  if (compact) {
    return (
      <div className={`p-4 rounded-2xl bg-gradient-to-br ${getConditionGradient()} shadow-lg relative overflow-hidden transition-all duration-300`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold tracking-tight">{location.name}</h3>
            <p className="text-xs opacity-90">{current.condition} • Feels like {current.feelsLike}°C</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-extrabold">{current.temp}°C</span>
            <WeatherIcon iconCode={current.icon} condition={current.condition} className="w-8 h-8" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-3xl p-6 bg-gradient-to-br ${getConditionGradient()} shadow-xl relative overflow-hidden my-3 border border-white/10`}>
      {/* Background ambient lighting */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 relative z-10">
        <div>
          <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider bg-white/20 backdrop-blur-md rounded-full">
            Current Weather
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold mt-2 tracking-tight">
            {location.name}{location.state ? `, ${location.state}` : ''}
          </h2>
          <p className="text-sm opacity-90 capitalize mt-0.5">{current.description}</p>
        </div>

        <div className="flex items-center gap-3">
          <WeatherIcon iconCode={current.icon} condition={current.condition} className="w-14 h-14 drop-shadow-md" />
          <div>
            <div className="text-4xl sm:text-5xl font-black tracking-tight">{current.temp}°C</div>
            <div className="text-xs opacity-80 font-medium">Feels like {current.feelsLike}°C</div>
          </div>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-white/15 relative z-10 text-xs sm:text-sm">
        <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md p-2.5 rounded-xl">
          <Droplets className="w-4 h-4 text-sky-200 shrink-0" />
          <div>
            <div className="opacity-75 text-[11px]">Humidity</div>
            <div className="font-semibold">{current.humidity}%</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md p-2.5 rounded-xl">
          <Wind className="w-4 h-4 text-emerald-200 shrink-0" />
          <div>
            <div className="opacity-75 text-[11px]">Wind</div>
            <div className="font-semibold">{current.windSpeed} km/h</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md p-2.5 rounded-xl">
          <CloudRain className="w-4 h-4 text-blue-200 shrink-0" />
          <div>
            <div className="opacity-75 text-[11px]">Rain Chance</div>
            <div className="font-semibold">{current.rainProbability}%</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md p-2.5 rounded-xl">
          <Eye className="w-4 h-4 text-amber-200 shrink-0" />
          <div>
            <div className="opacity-75 text-[11px]">Visibility</div>
            <div className="font-semibold">{current.visibility} km</div>
          </div>
        </div>
      </div>

      {/* Secondary Details Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-white/10 text-xs opacity-90 relative z-10">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Sunrise className="w-3.5 h-3.5 text-amber-300" />
            {current.sunrise}
          </span>
          <span className="flex items-center gap-1">
            <Sunset className="w-3.5 h-3.5 text-orange-300" />
            {current.sunset}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span>UV Index: <strong className="font-semibold">{current.uvIndex}</strong></span>
          <span>Pressure: <strong className="font-semibold">{current.pressure} hPa</strong></span>
        </div>
      </div>
    </div>
  );
}
