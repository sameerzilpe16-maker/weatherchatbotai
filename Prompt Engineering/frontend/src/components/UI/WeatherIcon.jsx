import React from 'react';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudLightning,
  Snowflake,
  CloudFog,
  Wind
} from 'lucide-react';

export default function WeatherIcon({ iconCode, condition = '', className = 'w-6 h-6' }) {
  const code = (iconCode || '').toLowerCase();
  const cond = (condition || '').toLowerCase();

  if (code.includes('01') || cond.includes('clear') || cond.includes('sunny')) {
    return <Sun className={`${className} text-amber-500 animate-spin-slow`} />;
  }
  if (code.includes('02') || cond.includes('partly')) {
    return <CloudSun className={`${className} text-amber-400`} />;
  }
  if (code.includes('03') || code.includes('04') || cond.includes('cloud')) {
    return <Cloud className={`${className} text-slate-400 dark:text-slate-300`} />;
  }
  if (code.includes('09') || code.includes('10') || cond.includes('rain') || cond.includes('shower')) {
    return <CloudRain className={`${className} text-sky-500`} />;
  }
  if (code.includes('11') || cond.includes('thunder') || cond.includes('storm')) {
    return <CloudLightning className={`${className} text-amber-500`} />;
  }
  if (code.includes('13') || cond.includes('snow')) {
    return <Snowflake className={`${className} text-blue-300`} />;
  }
  if (code.includes('50') || cond.includes('fog') || cond.includes('haze') || cond.includes('mist')) {
    return <CloudFog className={`${className} text-slate-400`} />;
  }

  return <Wind className={`${className} text-emerald-500`} />;
}
