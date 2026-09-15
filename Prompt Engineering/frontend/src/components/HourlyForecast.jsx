import React from 'react';
import WeatherIcon from './UI/WeatherIcon';
import { Droplets } from 'lucide-react';

export default function HourlyForecast({ hourlyData }) {
  if (!hourlyData || hourlyData.length === 0) return null;

  return (
    <div className="my-3 bg-white/70 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 shadow-sm backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          24-Hour Hourly Forecast
        </h4>
        <span className="text-[11px] text-slate-400">Scroll →</span>
      </div>

      {/* Horizontal scroll container */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {hourlyData.map((item, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 flex flex-col items-center justify-between p-3 min-w-[76px] bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/50 rounded-xl transition-all duration-200 hover:border-emerald-500/50"
          >
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
              {item.time}
            </span>

            <div className="my-2">
              <WeatherIcon iconCode={item.icon} condition={item.condition} className="w-6 h-6" />
            </div>

            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
              {item.temp}°
            </span>

            <div className="flex items-center gap-0.5 mt-1 text-[10px] text-sky-600 dark:text-sky-400 font-semibold">
              <Droplets className="w-2.5 h-2.5" />
              {item.rainProb}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
