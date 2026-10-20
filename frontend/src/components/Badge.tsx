import React from 'react';
import { AttendanceStatus, SessionStatus } from '../types';

interface BadgeProps {
  status: AttendanceStatus | SessionStatus | string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ status, size = 'sm' }) => {
  const normalized = status.toLowerCase();

  const styles: Record<string, string> = {
    present: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
    absent: 'bg-rose-50 text-rose-800 border-rose-200',
    late: 'bg-orange-50 text-orange-800 border-orange-200',
    excused: 'bg-stone-100 text-stone-700 border-stone-300',
    active: 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse font-bold',
    completed: 'bg-stone-100 text-stone-700 border-stone-200',
    scheduled: 'bg-wine-50 text-wine-800 border-wine-200',
    cancelled: 'bg-rose-50 text-rose-800 border-rose-200',
  };

  const defaultStyle = 'bg-stone-100 text-stone-700 border-stone-200';
  const sizeStyle = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center font-bold capitalize rounded-full border ${
        styles[normalized] || defaultStyle
      } ${sizeStyle}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70"></span>
      {status}
    </span>
  );
};
