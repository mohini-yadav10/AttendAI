import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  color?: 'primary' | 'sage' | 'gold' | 'charcoal';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'primary',
}) => {
  const iconColorMap = {
    primary: 'bg-primary-50 text-primary-600',
    sage: 'bg-sage-50 text-sage-600',
    gold: 'bg-gold-50 text-gold-600',
    charcoal: 'bg-charcoal-100 text-charcoal-600',
  };

  return (
    <div className="bg-surface rounded-xl border border-charcoal-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-charcoal-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-charcoal-900 mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${iconColorMap[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {(subtitle || trend) && (
        <div className="mt-3 flex items-center text-xs space-x-2">
          {trend && (
            <span
              className={`font-bold ${
                trend.positive ? 'text-amber-600' : 'text-rose-600'
              }`}
            >
              {trend.positive ? '↑' : '↓'} {trend.value}
            </span>
          )}
          {subtitle && <span className="text-charcoal-500">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
