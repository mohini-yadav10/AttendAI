import React, { useEffect, useState } from 'react';

interface CircularProgressProps {
  value: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  color?: string; // hex or tailwind stroke
  bgColor?: string;
  label?: string;
  sublabel?: string;
  displayValue?: string | number;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 90,
  strokeWidth = 7,
  color = '#4f46e5',
  bgColor = '#e0e7ff',
  label,
  sublabel,
  displayValue,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(value);
    }, 150);
    return () => clearTimeout(timer);
  }, [value]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center group">
      <div className="relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={bgColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Progress Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Display Value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-black tracking-tight text-charcoal-900 leading-none">
            {displayValue !== undefined ? displayValue : `${progress}%`}
          </span>
        </div>
      </div>

      {/* Outer Labels */}
      {label && (
        <span className="mt-2 text-xs font-semibold text-charcoal-700 text-center tracking-tight">
          {label}
        </span>
      )}
      {sublabel && (
        <span className="text-[10px] text-charcoal-400 text-center font-medium">
          {sublabel}
        </span>
      )}
    </div>
  );
};
