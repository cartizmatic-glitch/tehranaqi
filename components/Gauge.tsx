import React from 'react';
import { AQILevel } from '../types';

interface GaugeProps {
  aqi: number | null;
  level: AQILevel;
}

const Gauge: React.FC<GaugeProps> = ({ aqi, level }) => {
  const getColors = (level: AQILevel) => {
    switch (level) {
      case AQILevel.Good: return 'from-green-400 to-green-600 shadow-green-200 text-green-800';
      case AQILevel.Moderate: return 'from-yellow-300 to-yellow-500 shadow-yellow-200 text-yellow-900';
      case AQILevel.UnhealthySensitive: return 'from-orange-400 to-orange-600 shadow-orange-200 text-white';
      case AQILevel.Unhealthy: return 'from-red-500 to-red-700 shadow-red-300 text-white';
      case AQILevel.VeryUnhealthy: return 'from-purple-500 to-purple-700 shadow-purple-300 text-white';
      case AQILevel.Hazardous: return 'from-rose-800 to-red-900 shadow-red-900 text-white';
      default: return 'from-gray-300 to-gray-400 shadow-gray-200 text-gray-600';
    }
  };

  const getStatusText = (level: AQILevel) => {
    switch (level) {
        case AQILevel.Good: return 'پاک';
        case AQILevel.Moderate: return 'سالم';
        case AQILevel.UnhealthySensitive: return 'ناسالم حساس';
        case AQILevel.Unhealthy: return 'ناسالم';
        case AQILevel.VeryUnhealthy: return 'بسیار ناسالم';
        case AQILevel.Hazardous: return 'خطرناک';
        default: return 'نامشخص';
    }
  };

  const colors = getColors(level);

  return (
    <div className="flex flex-col items-center justify-center my-8">
      <div className={`relative flex items-center justify-center w-64 h-64 rounded-full bg-gradient-to-br ${colors} shadow-2xl transition-all duration-1000 transform hover:scale-105`}>
        <div className="absolute inset-2 bg-white/20 rounded-full blur-sm"></div>
        <div className="flex flex-col items-center z-10">
            <span className="text-6xl font-black tracking-tighter drop-shadow-md">
                {aqi !== null ? aqi : '?'}
            </span>
            <span className="text-xl font-bold mt-2 opacity-90 tracking-wide">
                {getStatusText(level)}
            </span>
            <span className="text-xs mt-1 opacity-75 font-medium">شاخص کیفیت هوا</span>
        </div>
      </div>
    </div>
  );
};

export default Gauge;