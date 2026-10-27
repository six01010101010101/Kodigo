import React from 'react';
import { Flame, Heart, Gem, Crown, Code2 } from 'lucide-react';
import { UserGamificationState, CodeTrack } from '../../types/kodigo.types';

interface HeaderProps {
  userState: UserGamificationState;
  activeTrack: CodeTrack;
  onOpenPricing: () => void;
  onOpenTracks: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userState,
  activeTrack,
  onOpenPricing,
  onOpenTracks
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b-2 border-duo-border px-4 lg:px-8 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Logo and Track Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onOpenTracks}>
            <div className="w-10 h-10 rounded-xl bg-duo-green flex items-center justify-center shadow-duo-green">
              <Code2 className="w-6 h-6 text-white stroke-[2.5]" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-duo-green hidden sm:inline">
              kodigo
            </span>
          </div>

          <button
            onClick={onOpenTracks}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 border-duo-border hover:bg-duo-bg-light transition-colors font-bold text-sm text-duo-charcoal ml-2"
          >
            <span className="text-base">{activeTrack.icon}</span>
            <span className="hidden md:inline">{activeTrack.name}</span>
          </button>
        </div>

        {/* Gamification Stats */}
        <div className="flex items-center gap-4 sm:gap-6 font-extrabold text-sm sm:text-base">
          {/* Streak */}
          <div className="flex items-center gap-1.5 text-duo-yellow-dark" title="Dias de ofensiva">
            <Flame className="w-5 h-5 fill-duo-yellow text-duo-yellow-dark animate-pulse" />
            <span>{userState.streak}</span>
          </div>

          {/* Gems */}
          <div className="flex items-center gap-1.5 text-duo-blue" title="Gemas acumuladas">
            <Gem className="w-5 h-5 fill-duo-blue text-duo-blue-dark" />
            <span>{userState.gems}</span>
          </div>

          {/* Hearts */}
          <div className="flex items-center gap-1.5 text-duo-red" title="Vidas restantes">
            <Heart className="w-5 h-5 fill-duo-red text-duo-red-dark" />
            <span>{userState.isPro ? '∞' : userState.hearts}</span>
          </div>

          {/* Pro / Free Plan Badge */}
          <button
            onClick={onOpenPricing}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs uppercase tracking-wider font-black transition-transform active:scale-95 ${
              userState.isPro
                ? 'bg-gradient-to-r from-duo-purple to-indigo-500 text-white shadow-duo-purple'
                : 'bg-duo-yellow text-duo-charcoal hover:brightness-105 shadow-duo-yellow'
            }`}
          >
            <Crown className="w-4 h-4" />
            <span>{userState.isPro ? 'PRO ATIVO' : 'SEJA PRO'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
