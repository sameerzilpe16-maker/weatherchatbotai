import React from 'react';
import WeatherIcon from './UI/WeatherIcon';
import { Droplets } from 'lucide-react';

export default function ForecastCard({ dailyData }) {
  if (!dailyData || dailyData.length === 0) return null;

  return (
    <div className="my-3 bg-white/70 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 shadow-sm backdrop-blur-sm">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
        5-Day Weather Forecast
      </h4>

      <div className="space-y-2">
        {dailyData.map((day, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-2.5 bg-slate-50/80 dark:bg-slate-900/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 rounded-xl transition-colors duration-150 border border-slate-100 dark:border-slate-700/40"
          >
            {/* Day name & date */}
            <div className="w-24 sm:w-28">
              <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                {day.day}
              </div>
              <div className="text-[11px] text-slate-400">{day.date}</div>
            </div>

            {/* Condition Icon + Label */}
            <div className="flex items-center gap-2 flex-1 justify-center sm:justify-start">
              <WeatherIcon iconCode={day.icon} condition={day.condition} className="w-5 h-5" />
              <span className="hidden sm:inline text-xs font-medium text-slate-600 dark:text-slate-300 capitalize">
                {day.condition}
              </span>
            </div>

            {/* Rain Probability Badge */}
            <div className="flex items-center gap-1 text-xs text-sky-600 dark:text-sky-400 font-semibold px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/50 border border-sky-100 dark:border-sky-800/50 mr-3">
              <Droplets className="w-3 h-3" />
              {day.rainProb}%
            </div>

            {/* High / Low Temp */}
            <div className="text-xs sm:text-sm font-semibold text-right min-w-[70px]">
              <span className="text-slate-800 dark:text-slate-100">{day.tempMax}°</span>
              <span className="text-slate-400 mx-1">/</span>
              <span className="text-slate-400 font-normal">{day.tempMin}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
