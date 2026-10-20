import React from 'react';
import { AttendanceStatus, SessionStatus } from '../types';

interface BadgeProps {
  status: AttendanceStatus | SessionStatus | string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ status, size = 'sm' }) => {
  const normalized = status.toLowerCase();

  const styles: Record<string, string> = {
    present: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    absent: 'bg-rose-50 text-rose-700 border-rose-200',
    late: 'bg-amber-50 text-amber-700 border-amber-200',
    excused: 'bg-sky-50 text-sky-700 border-sky-200',
    active: 'bg-green-50 text-green-700 border-green-200 animate-pulse',
    completed: 'bg-charcoal-100 text-charcoal-700 border-charcoal-300',
    scheduled: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  const defaultStyle = 'bg-charcoal-100 text-charcoal-700 border-charcoal-200';
  const sizeStyle = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center font-medium capitalize rounded-full border ${styles[normalized] || defaultStyle} ${sizeStyle}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70"></span>
      {status}
    </span>
  );
};
