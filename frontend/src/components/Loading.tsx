import React from 'react';

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; text?: string }> = ({
  size = 'md',
  text,
}) => {
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-3">
      <div
        className={`${sizeMap[size]} border-charcoal-200 border-t-primary-600 rounded-full animate-spin`}
      />
      {text && <p className="text-sm font-medium text-charcoal-500">{text}</p>}
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 4,
}) => {
  return (
    <div className="w-full space-y-3 animate-pulse">
      <div className="h-10 bg-charcoal-100 rounded-lg w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-3">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-12 bg-charcoal-50 rounded-lg flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};
