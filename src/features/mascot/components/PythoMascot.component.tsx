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
            <path d="M 68 56 Q 76 46 84 56" stroke="#06B6D4" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <path d="M 96 56 Q 104 46 112 56" stroke="#06B6D4" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          </>
        );
      case 'thinking':
        return (
          <>
            <ellipse cx="76" cy="54" rx="8" ry="9" fill="#0F172A" />
            <ellipse cx="104" cy="54" rx="8" ry="9" fill="#0F172A" />
            <text x="76" y="58" fill="#67E8F9" fontSize="9" fontFamily="monospace" textAnchor="middle">&lt;</text>
            <text x="104" y="58" fill="#67E8F9" fontSize="9" fontFamily="monospace" textAnchor="middle">&gt;</text>
          </>
        );
      case 'sad':
        return (
          <>
            <ellipse cx="76" cy="56" rx="7.5" ry="9" fill="#0F172A" />
            <ellipse cx="104" cy="56" rx="7.5" ry="9" fill="#0F172A" />
            <circle cx="76" cy="56" r="4.5" fill="#FEF08A" />
            <circle cx="104" cy="56" r="4.5" fill="#FEF08A" />
            <path d="M 69 46 Q 76 50 83 46" stroke="#64748B" strokeWidth="2.5" fill="none" />
            <path d="M 97 46 Q 104 50 111 46" stroke="#64748B" strokeWidth="2.5" fill="none" />
          </>
        );
      default:
        return (
          <>
            {/* Authentic Cobra Slit-Pupil Gaze */}
            <ellipse cx="76" cy="54" rx="8" ry="10" fill="#0F172A" />
            <ellipse cx="76" cy="54" rx="6.5" ry="8.5" fill="#FEF08A" />
            <path d="M 76 46 Q 78 54 76 62 Q 74 54 76 46" fill="#0F172A" />
            <circle cx="78" cy="51" r="2" fill="#FFFFFF" />

            <ellipse cx="104" cy="54" rx="8" ry="10" fill="#0F172A" />
            <ellipse cx="104" cy="54" rx="6.5" ry="8.5" fill="#FEF08A" />
            <path d="M 104 46 Q 106 54 104 62 Q 102 54 104 46" fill="#0F172A"/>
            <circle cx="106" cy="51" r="2" fill="#FFFFFF" />
          </>
        );
    }
  };

  const getTongueAndMouth = () => {
    if (emotion === 'sad') {
      return <path d="M 82 72 Q 90 67 98 72" stroke="#064E3B" strokeWidth="2.5" fill="none" strokeLinecap="round" />;
    }
    return (
      <>
        <path d="M 81 67 Q 90 73 99 67" stroke="#064E3B" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 90 71 L 90 83 M 90 83 L 85 90 M 90 83 L 95 90" stroke="#EF4444" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </>
    );
  };

  return (
    <div className="relative flex items-center gap-4">
      <div
        onClick={onMascotClick}
        className="cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95 flex-shrink-0"
        title="Pytho, a serpente de código! Clique para dicas."
      >
        <svg
          viewBox="0 0 180 180"
          className={`${sizeMap[size]} drop-shadow-xl transition-all duration-300`}
        >
          <defs>
            <linearGradient id="pCobraScale" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="50%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#064E3B" />
            </linearGradient>
            <linearGradient id="pBelly" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="100%" stopColor="#EAB308" />
            </linearGradient>
            <linearGradient id="pCyber" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#67E8F9" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>

          {/* Lower Coils S-Spiral */}
          <path d="M 32 142 C 22 118, 56 108, 90 120 C 124 132, 158 122, 150 148 C 142 168, 42 168, 32 142 Z" fill="url(#pCobraScale)" />
          <path d="M 46 138 C 62 126, 95 126, 122 136 C 114 154, 54 154, 46 138 Z" fill="url(#pBelly)" />

          {/* Cobra Flared Hood (Capelo Naja) */}
          <path d="M 90 32 C 40 45, 30 92, 68 112 C 80 118, 100 118, 112 112 C 150 92, 140 45, 90 32 Z" fill="url(#pCobraScale)" />
          
          {/* Cyber Code Glyphs on Flared Hood */}
          <path d="M 48 70 Q 56 82 50 94" stroke="url(#pCyber)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <text x="51" y="86" fill="#67E8F9" fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="bold">&lt;</text>
          
          <path d="M 132 70 Q 124 82 130 94" stroke="url(#pCyber)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <text x="123" y="86" fill="#67E8F9" fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="bold">&gt;</text>

          {/* Serpent Head */}
          <path d="M 90 28 C 70 30, 62 48, 68 68 C 74 84, 106 84, 112 68 C 118 48, 110 30, 90 28 Z" fill="url(#pCobraScale)" />

          {/* Eyes and Mouth */}
          {getEyes()}
          {getTongueAndMouth()}

          {/* Cyber Coding Collar */}
          <rect x="79" y="102" width="22" height="14" rx="4" fill="#0F172A" />
          <text x="90" y="112" fill="#06B6D4" fontFamily="'JetBrains Mono', monospace" fontSize="9" fontWeight="900" textAnchor="middle">&lt;/&gt;</text>
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
