import React from 'react';
import { Sparkles } from 'lucide-react';

interface ClashChestGraphicProps {
  state: 'closed' | 'rumbling' | 'open';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const ClashChestGraphic: React.FC<ClashChestGraphicProps> = ({
  state,
  size = 'md',
  onClick,
}) => {
  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-36 h-36',
    lg: 'w-52 h-52'
  };

  const isRumbling = state === 'rumbling';
  const isOpen = state === 'open';

  return (
    <div
      onClick={onClick}
      className={`relative select-none flex items-center justify-center cursor-pointer transition-transform ${
        sizeClasses[size]
      } ${isRumbling ? 'animate-bounce scale-110' : 'hover:scale-105 active:scale-95'}`}
    >
      {/* Background Divine God Rays when open or rumbling */}
      {(isOpen || isRumbling) && (
        <div className="absolute inset-0 -m-16 rounded-full bg-gradient-to-r from-amber-400/30 via-yellow-300/40 to-amber-500/30 blur-2xl animate-pulse pointer-events-none" />
      )}

      {/* SVG Royal Chest */}
      <svg
        viewBox="0 0 200 180"
        className={`w-full h-full drop-shadow-2xl transition-all duration-300 ${
          isRumbling ? 'rotate-[-3deg] translate-x-1' : ''
        }`}
      >
        <defs>
          <linearGradient id="chestWood" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#854D0E" />
            <stop offset="50%" stopColor="#A16207" />
            <stop offset="100%" stopColor="#713F12" />
          </linearGradient>
          <linearGradient id="chestGold" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="40%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#CA8A04" />
          </linearGradient>
          <linearGradient id="chestInterior" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>
        </defs>

        {/* Chest Base Box */}
        <rect x="25" y="80" width="150" height="85" rx="14" fill="url(#chestWood)" stroke="#451A03" strokeWidth="6" />
        
        {/* Interior Glow (Visible when open) */}
        {isOpen && (
          <path
            d="M 32 82 L 168 82 L 155 125 L 45 125 Z"
            fill="url(#chestInterior)"
            className="animate-pulse opacity-90"
          />
        )}

        {/* Golden Straps and Rivets on Base */}
        <rect x="52" y="80" width="22" height="85" fill="url(#chestGold)" stroke="#78350F" strokeWidth="3" />
        <rect x="126" y="80" width="22" height="85" fill="url(#chestGold)" stroke="#78350F" strokeWidth="3" />
        <circle cx="63" cy="98" r="3.5" fill="#FEF08A" stroke="#713F12" strokeWidth="1" />
        <circle cx="63" cy="142" r="3.5" fill="#FEF08A" stroke="#713F12" strokeWidth="1" />
        <circle cx="137" cy="98" r="3.5" fill="#FEF08A" stroke="#713F12" strokeWidth="1" />
        <circle cx="137" cy="142" r="3.5" fill="#FEF08A" stroke="#713F12" strokeWidth="1" />

        {/* Chest Lid: Closed vs Open */}
        {!isOpen ? (
          <g className={isRumbling ? 'translate-y-[-4px]' : ''}>
            {/* Closed Dome Lid */}
            <path
              d="M 20 82 Q 25 24, 100 24 Q 175 24, 180 82 Z"
              fill="url(#chestWood)"
              stroke="#451A03"
              strokeWidth="6"
            />
            {/* Golden Straps on Lid */}
            <path d="M 52 82 Q 55 26, 63 24 L 85 24 Q 77 26, 74 82 Z" fill="url(#chestGold)" stroke="#78350F" strokeWidth="3" />
            <path d="M 126 82 Q 123 26, 115 24 L 137 24 Q 145 26, 148 82 Z" fill="url(#chestGold)" stroke="#78350F" strokeWidth="3" />
            
            {/* Big Golden Lock Plate & Gem */}
            <rect x="80" y="68" width="40" height="34" rx="8" fill="url(#chestGold)" stroke="#78350F" strokeWidth="4" />
            <circle cx="100" cy="85" r="9" fill="#EF4444" stroke="#991B1B" strokeWidth="2.5" />
            <circle cx="98" cy="83" r="3" fill="#FFFFFF" opacity="0.8" />
          </g>
        ) : (
          <g className="origin-top-left transition-transform duration-500">
            {/* Open Lid swung back upwards */}
            <path
              d="M 15 50 Q 25 -10, 100 -10 Q 175 -10, 185 50 Z"
              fill="url(#chestWood)"
              stroke="#451A03"
              strokeWidth="6"
              transform="scale(1, 0.7) translate(0, 15)"
            />
            <path
              d="M 45 42 L 58 10 L 76 10 L 63 42 Z"
              fill="url(#chestGold)"
              stroke="#78350F"
              strokeWidth="2"
            />
            <path
              d="M 125 42 L 138 10 L 156 10 L 143 42 Z"
              fill="url(#chestGold)"
              stroke="#78350F"
              strokeWidth="2"
            />
          </g>
        )}
      </svg>

      {/* Floating Sparkles when Opened */}
      {isOpen && (
        <div className="absolute -top-6 flex items-center justify-center animate-bounce pointer-events-none">
          <Sparkles className="w-10 h-10 text-yellow-300 drop-shadow-lg animate-spin" />
        </div>
      )}
    </div>
  );
};
