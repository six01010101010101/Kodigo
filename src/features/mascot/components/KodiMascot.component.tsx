import React from 'react';
import { MascotEmotion } from '../../../types/kodigo.types';

interface KodiMascotProps {
  emotion: MascotEmotion;
  speechText?: string;
  onMascotClick?: () => void;
}

export const KodiMascot: React.FC<KodiMascotProps> = ({
  emotion,
  speechText,
  onMascotClick
}) => {
  const getEyeExpression = () => {
    switch (emotion) {
      case 'happy':
      case 'cheering':
        return (
          <>
            <path d="M 38 48 Q 43 40 48 48" stroke="#1CB0F6" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M 72 48 Q 77 40 82 48" stroke="#1CB0F6" strokeWidth="4" fill="none" strokeLinecap="round" />
          </>
        );
      case 'thinking':
        return (
          <>
            <circle cx="45" cy="42" r="6" fill="#1CB0F6" />
            <circle cx="75" cy="42" r="6" fill="#1CB0F6" />
          </>
        );
      case 'sad':
        return (
          <>
            <circle cx="45" cy="48" r="6" fill="#1CB0F6" />
            <circle cx="75" cy="48" r="6" fill="#1CB0F6" />
            <path d="M 40 40 Q 45 44 50 40" stroke="#777777" strokeWidth="2" fill="none" />
            <path d="M 70 40 Q 75 44 80 40" stroke="#777777" strokeWidth="2" fill="none" />
          </>
        );
      default:
        return (
          <>
            <circle cx="45" cy="46" r="7" fill="#1CB0F6" />
            <circle cx="75" cy="46" r="7" fill="#1CB0F6" />
            <circle cx="47" cy="44" r="2.5" fill="#FFFFFF" />
            <circle cx="77" cy="44" r="2.5" fill="#FFFFFF" />
          </>
        );
    }
  };

  return (
    <div className="relative flex items-center gap-4">
      <div 
        onClick={onMascotClick}
        className="cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95 flex-shrink-0"
        title="Clique para conversar com o Kodi!"
      >
        <svg 
          viewBox="0 0 120 120" 
          className="w-24 h-24 drop-shadow-md animate-bounce"
          style={{ animationDuration: emotion === 'cheering' ? '0.6s' : '3s' }}
        >
          <defs>
            <linearGradient id="owlGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#58CC02" />
              <stop offset="100%" stopColor="#46A302" />
            </linearGradient>
          </defs>
          <rect x="20" y="20" width="80" height="80" rx="35" fill="url(#owlGradient)" />
          <ellipse cx="60" cy="72" rx="26" ry="22" fill="#FFFFFF" />
          <circle cx="43" cy="46" r="14" fill="#FFFFFF" />
          <circle cx="77" cy="46" r="14" fill="#FFFFFF" />
          {getEyeExpression()}
          <polygon points="56,53 64,53 60,61" fill="#FF9600" />
          <text 
            x="60" 
            y="78" 
            fontFamily="'JetBrains Mono', monospace" 
            fontSize="15" 
            fontWeight="bold" 
            fill="#58CC02" 
            textAnchor="middle"
          >
            &lt;/&gt;
          </text>
          <ellipse cx="44" cy="100" rx="9" ry="5" fill="#FF9600" />
          <ellipse cx="76" cy="100" rx="9" ry="5" fill="#FF9600" />
        </svg>
      </div>

      {speechText && (
        <div className="relative bg-white border-2 border-duo-border rounded-2xl p-4 shadow-sm max-w-xs animate-fade-in">
          <p className="text-sm font-bold text-duo-charcoal leading-snug">
            {speechText}
          </p>
          <div className="absolute top-1/2 -left-2 w-3 h-3 bg-white border-b-2 border-l-2 border-duo-border transform -translate-y-1/2 rotate-45" />
        </div>
      )}
    </div>
  );
};
