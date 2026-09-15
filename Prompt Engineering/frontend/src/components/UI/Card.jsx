import React from 'react';

export default function Card({ children, className = '', hover = false }) {
  return (
    <div
      className={`bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 shadow-sm ${
        hover ? 'transition-all duration-200 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
