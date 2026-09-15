import React from 'react';
import { AlertTriangle, ShieldAlert, ThermometerSun, Wind } from 'lucide-react';
import Badge from './UI/Badge';

export default function WeatherAlert({ alerts }) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="my-3 space-y-2">
      {alerts.map((alert, idx) => {
        const isHigh = alert.severity === 'high' || alert.severity === 'extreme';
        const bgClass = isHigh
          ? 'bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-200'
          : 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200';

        return (
          <div
            key={idx}
            className={`p-4 rounded-2xl border backdrop-blur-sm shadow-sm flex items-start gap-3 ${bgClass}`}
          >
            <div className="p-2 rounded-xl bg-white/60 dark:bg-slate-900/60 shrink-0">
              {isHigh ? (
                <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h5 className="text-sm font-bold tracking-tight">{alert.title}</h5>
                <Badge variant={isHigh ? 'danger' : 'warning'}>
                  {alert.severity ? alert.severity.toUpperCase() : 'ADVISORY'}
                </Badge>
              </div>
              <p className="text-xs leading-relaxed opacity-90">{alert.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
