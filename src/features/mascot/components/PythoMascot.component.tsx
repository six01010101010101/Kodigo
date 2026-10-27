import React from 'react';
import { MascotEmotion } from '../../../types/kodigo.types';

interface PythoMascotProps {
  emotion: MascotEmotion;
  speechText?: string;
  onMascotClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const PythoMascot: React.FC<PythoMascotProps> = ({
  emotion,
  speechText,
  onMascotClick,
  size = 'md'
}) => {
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24 sm:w-28 sm:h-28',
    lg: 'w-36 h-36'
  };

  const getEyeExpression = () => {
    switch (emotion) {
      case 'happy':
      case 'cheering':
        return (
          <>
            <path d="M 54 58 Q 63 46 72 58" stroke="#0284C7" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M 88 58 Q 97 46 106 58" stroke="#0284C7" strokeWidth="4" fill="none" strokeLinecap="round" />
          </>
        );
      case 'thinking':
        return (
          <>
            <circle cx="65" cy="50" r="8" fill="#0284C7" />
            <circle cx="95" cy="50" r="8" fill="#0284C7" />
            <circle cx="67" cy="48" r="3" fill="#FFFFFF" />
            <circle cx="97" cy="48" r="3" fill="#FFFFFF" />
          </>
        );
      case 'sad':
        return (
          <>
            <circle cx="64" cy="58" r="7" fill="#0284C7" />
            <circle cx="96" cy="58" r="7" fill="#0284C7" />
            <path d="M 56 46 Q 64 50 72 46" stroke="#475569" strokeWidth="2.5" fill="none" />
            <path d="M 88 46 Q 96 50 104 46" stroke="#475569" strokeWidth="2.5" fill="none" />
          </>
        );
      default:
        return (
          <>
            <circle cx="65" cy="55" r="9" fill="#0284C7" />
            <circle cx="95" cy="55" r="9" fill="#0284C7" />
            <circle cx="68" cy="52" r="3.5" fill="#FFFFFF" />
            <circle cx="98" cy="52" r="3.5" fill="#FFFFFF" />
          </>
        );
    }
  };

  const getMouthExpression = () => {
    if (emotion === 'sad') {
      return <path d="M 70 82 Q 80 74 90 82" stroke="#14532D" strokeWidth="3" fill="none" strokeLinecap="round" />;
    }
    if (emotion === 'cheering' || emotion === 'happy') {
      return (
        <>
          <path d="M 68 76 Q 80 92 92 76 Z" fill="#EF4444" stroke="#14532D" strokeWidth="2.5" />
          <path d="M 80 84 Q 82 96 87 99 M 80 90 L 76 97" stroke="#DC2626" strokeWidth="2" fill="none" />
        </>
      );
    }
    return (
      <>
        <path d="M 68 76 Q 80 86 92 76" stroke="#14532D" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M 80 82 Q 80 92 84 95 M 80 88 L 77 94" stroke="#EF4444" strokeWidth="2" fill="none" strokeLinecap="round" />
      </>
    );
  };

  return (
    <div className="relative flex items-center gap-4">
      <div
        onClick={onMascotClick}
        className="cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95 flex-shrink-0"
        title="Pytho, a cobra mentora de programação! Clique para interagir."
      >
        <svg
          viewBox="0 0 160 160"
          className={`${sizeMap[size]} drop-shadow-md animate-bounce`}
          style={{ animationDuration: emotion === 'cheering' ? '0.7s' : '3.5s' }}
        >
          <defs>
            <linearGradient id="pGreen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4ADE80" />
              <stop offset="60%" stopColor="#22C55E" />
              <stop offset="100%" stopColor="#16A34A" />
            </linearGradient>
            <linearGradient id="pYellow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="100%" stopColor="#FACC15" />
            </linearGradient>
          </defs>

          {/* Coiled Body with cartoon 3D volume */}
          <path d="M 35 130 C 25 110, 45 95, 75 105 C 105 115, 135 110, 130 135 C 125 152, 45 152, 35 130 Z" fill="url(#pGreen)" />
          <path d="M 52 120 C 66 114, 94 114, 108 124 C 104 136, 56 136, 52 120 Z" fill="url(#pYellow)" />

          {/* Head */}
          <ellipse cx="80" cy="65" rx="42" ry="36" fill="url(#pGreen)" />
          <ellipse cx="49" cy="74" rx="7" ry="5" fill="#F87171" opacity="0.45" />
          <ellipse cx="111" cy="74" rx="7" ry="5" fill="#F87171" opacity="0.45" />

          {/* Eyes Base */}
          <circle cx="63" cy="55" r="15" fill="#FFFFFF" />
          <circle cx="97" cy="55" r="15" fill="#FFFFFF" />

          {/* Dynamic Expression */}
          {getEyeExpression()}
          {getMouthExpression()}

          {/* Tech Emblem (Python Brackets) */}
          <rect x="73" y="24" width="14" height="12" rx="4" fill="#3B82F6" />
          <text x="80" y="33" fontFamily="'JetBrains Mono', monospace" fontSize="8" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">
            Py
          </text>
        </svg>
      </div>

      {speechText && (
        <div className="relative bg-white dark:bg-slate-800 border-2 border-duo-border dark:border-slate-700 rounded-2xl p-4 shadow-sm max-w-xs transition-colors">
          <p className="text-xs sm:text-sm font-bold text-duo-charcoal dark:text-slate-100 leading-snug">
            {speechText}
          </p>
          <div className="absolute top-1/2 -left-2 w-3 h-3 bg-white dark:bg-slate-800 border-b-2 border-l-2 border-duo-border dark:border-slate-700 transform -translate-y-1/2 rotate-45" />
        </div>
      )}
    </div>
  );
};
