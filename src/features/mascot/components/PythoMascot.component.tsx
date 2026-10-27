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
    sm: 'w-14 h-14',
    md: 'w-24 h-24 sm:w-28 sm:h-28',
    lg: 'w-36 h-36'
  };

  const getEyes = () => {
    switch (emotion) {
      case 'happy':
      case 'cheering':
        return (
          <>
            <path d="M 58 60 Q 66 50 74 60" stroke="#06B6D4" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <path d="M 86 60 Q 94 50 102 60" stroke="#06B6D4" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          </>
        );
      case 'thinking':
        return (
          <>
            <circle cx="66" cy="56" r="7" fill="#0F172A" />
            <circle cx="94" cy="56" r="7" fill="#0F172A" />
            <text x="66" y="59" fill="#06B6D4" fontSize="8" fontFamily="monospace" textAnchor="middle">&lt;</text>
            <text x="94" y="59" fill="#06B6D4" fontSize="8" fontFamily="monospace" textAnchor="middle">&gt;</text>
          </>
        );
      case 'sad':
        return (
          <>
            <circle cx="66" cy="60" r="7" fill="#0F172A" />
            <circle cx="94" cy="60" r="7" fill="#0F172A" />
            <circle cx="68" cy="58" r="4.5" fill="#06B6D4" />
            <circle cx="96" cy="58" r="4.5" fill="#06B6D4" />
            <path d="M 60 50 Q 66 54 72 50" stroke="#64748B" strokeWidth="2" fill="none" />
            <path d="M 88 50 Q 94 54 100 50" stroke="#64748B" strokeWidth="2" fill="none" />
          </>
        );
      default:
        return (
          <>
            <ellipse cx="66" cy="58" rx="8" ry="10" fill="#0F172A" />
            <ellipse cx="94" cy="58" rx="8" ry="10" fill="#0F172A" />
            <circle cx="68" cy="56" r="5" fill="#06B6D4" />
            <circle cx="96" cy="56" r="5" fill="#06B6D4" />
            <circle cx="69" cy="54" r="2" fill="#FFFFFF" />
            <circle cx="97" cy="54" r="2" fill="#FFFFFF" />
          </>
        );
    }
  };

  const getMouth = () => {
    if (emotion === 'sad') {
      return <path d="M 72 76 Q 80 72 88 76" stroke="#064E3B" strokeWidth="2.5" fill="none" strokeLinecap="round" />;
    }
    if (emotion === 'cheering' || emotion === 'happy') {
      return <path d="M 70 73 Q 80 82 90 73" stroke="#064E3B" strokeWidth="3" fill="none" strokeLinecap="round" />;
    }
    return <path d="M 72 74 Q 80 79 88 74" stroke="#064E3B" strokeWidth="2.5" fill="none" strokeLinecap="round" />;
  };

  return (
    <div className="relative flex items-center gap-4">
      <div
        onClick={onMascotClick}
        className="cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95 flex-shrink-0"
        title="Pytho, seu mentor de engenharia de software! Clique para dicas."
      >
        <svg
          viewBox="0 0 160 160"
          className={`${sizeMap[size]} drop-shadow-lg transition-all duration-300`}
        >
          <defs>
            <linearGradient id="pyGreen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="60%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="pyDark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="pyCyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#67E8F9" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>

          {/* Body and Cyber Jacket */}
          <path d="M 38 128 C 24 104, 52 90, 80 102 C 108 114, 138 104, 132 130 C 126 148, 48 148, 38 128 Z" fill="url(#pyDark)" />
          <path d="M 44 125 C 55 110, 80 110, 105 118 C 98 132, 52 134, 44 125 Z" fill="url(#pyGreen)" />

          {/* Head */}
          <ellipse cx="80" cy="62" rx="40" ry="34" fill="url(#pyGreen)" />

          {/* Developer Headset */}
          <path d="M 40 55 C 38 28, 122 28, 120 55" stroke="url(#pyDark)" strokeWidth="6" fill="none" strokeLinecap="round" />
          <circle cx="39" cy="56" r="8" fill="url(#pyCyan)" />
          <circle cx="121" cy="56" r="8" fill="url(#pyCyan)" />
          <path d="M 39 56 L 47 69" stroke="url(#pyDark)" strokeWidth="3" strokeLinecap="round" />
          <circle cx="48" cy="70" r="2.5" fill="#10B981" />

          {/* Eyes and Mouth */}
          {getEyes()}
          {getMouth()}

          {/* Tech Chest Emblem */}
          <rect x="74" y="98" width="12" height="12" rx="3.5" fill="url(#pyCyan)" />
          <circle cx="80" cy="104" r="2" fill="#0F172A" />
        </svg>
      </div>

      {speechText && (
        <div className="relative bg-white dark:bg-slate-800 border-2 border-duo-border dark:border-slate-700 rounded-2xl p-4 shadow-sm max-w-xs transition-colors">
          <p className="text-xs sm:text-sm font-extrabold text-duo-charcoal dark:text-slate-100 leading-snug">
            {speechText}
          </p>
          <div className="absolute top-1/2 -left-2 w-3 h-3 bg-white dark:bg-slate-800 border-b-2 border-l-2 border-duo-border dark:border-slate-700 transform -translate-y-1/2 rotate-45" />
        </div>
      )}
    </div>
  );
};
