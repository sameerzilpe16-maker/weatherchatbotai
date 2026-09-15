import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { Thermometer, Droplets, CloudRain } from 'lucide-react';

export default function WeatherChart({ hourlyData }) {
  const [activeTab, setActiveTab] = useState('temp'); // 'temp' | 'rain' | 'humidity'

  if (!hourlyData || hourlyData.length === 0) return null;

  // Format data for Recharts
  const chartData = hourlyData.slice(0, 12).map(item => ({
    time: item.time,
    Temp: item.temp,
    RainProb: item.rainProb,
    Humidity: item.humidity
  }));

  return (
    <div className="my-3 bg-white/70 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 shadow-sm backdrop-blur-sm">
      {/* Header and Tab Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Weather Analytics & Trends
        </h4>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl text-xs">
          <button
            onClick={() => setActiveTab('temp')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
              activeTab === 'temp'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            Temp (°C)
          </button>

          <button
            onClick={() => setActiveTab('rain')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
              activeTab === 'rain'
                ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            Rain (%)
          </button>

          <button
            onClick={() => setActiveTab('humidity')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
              activeTab === 'humidity'
                ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            Humidity (%)
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-48 sm:h-56 w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'temp' && (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} />
              <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11 }} unit="°" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  borderColor: '#334155',
                  color: '#fff',
                  borderRadius: '12px'
                }}
                formatter={(val) => [`${val}°C`, 'Temperature']}
              />
              <Area type="monotone" dataKey="Temp" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTemp)" />
            </AreaChart>
          )}

          {activeTab === 'rain' && (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  borderColor: '#334155',
                  color: '#fff',
                  borderRadius: '12px'
                }}
                formatter={(val) => [`${val}%`, 'Rain Probability']}
              />
              <Bar dataKey="RainProb" fill="#0284c7" radius={[6, 6, 0, 0]} />
            </BarChart>
          )}

          {activeTab === 'humidity' && (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  borderColor: '#334155',
                  color: '#fff',
                  borderRadius: '12px'
                }}
                formatter={(val) => [`${val}%`, 'Humidity']}
              />
              <Area type="monotone" dataKey="Humidity" stroke="#14b8a6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorHum)" />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
