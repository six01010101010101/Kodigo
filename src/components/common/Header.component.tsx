import React from 'react';
import { Flame, Heart, Gem, Crown, Code2, Bot, BookOpen, Target, Trophy, User, ShoppingBag } from 'lucide-react';
import { UserGamificationState, CodeTrack } from '../../types/kodigo.types';

export type MainNavTab = 'learn' | 'missions' | 'ranking' | 'profile';

interface HeaderProps {
  userState: UserGamificationState;
  activeTrack: CodeTrack;
  activeTab: MainNavTab;
  onChangeTab: (tab: MainNavTab) => void;
  onOpenPricing: () => void;
  onOpenTracks: () => void;
  onOpenAIChat: () => void;
  onOpenShop: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userState,
  activeTrack,
  activeTab,
  onChangeTab,
  onOpenPricing,
  onOpenTracks,
  onOpenAIChat,
  onOpenShop
}) => {
  const tabs: { id: MainNavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'learn', label: 'Aprender', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'missions', label: 'Missões', icon: <Target className="w-4 h-4" /> },
    { id: 'ranking', label: 'Ranking', icon: <Trophy className="w-4 h-4" /> },
    { id: 'profile', label: 'Perfil', icon: <User className="w-4 h-4" /> }
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b-2 border-duo-border dark:border-slate-800 px-4 lg:px-8 py-2.5 transition-colors">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Logo and Track Selector */}
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onOpenTracks}>
            <div className="w-9 h-9 rounded-xl bg-duo-green flex items-center justify-center shadow-duo-green">
              <Code2 className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-duo-green">
              kodigo
            </span>
          </div>

          <button
            onClick={onOpenTracks}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl border-2 border-duo-border dark:border-slate-700 hover:bg-duo-bg-light dark:hover:bg-slate-800 font-bold text-xs text-duo-charcoal dark:text-white ml-2"
          >
            <span className="text-sm">{activeTrack.icon}</span>
            <span className="hidden md:inline">{activeTrack.name}</span>
          </button>

          {/* AI Mobile Button */}
          <button
            onClick={onOpenAIChat}
            className="sm:hidden flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500 text-white font-black text-xs shadow-duo-green"
          >
            <Bot className="w-4 h-4" />
            <span>IA</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 p-1 rounded-2xl border border-duo-border dark:border-slate-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-700 text-duo-green shadow-duo-gray'
                  : 'text-duo-gray dark:text-slate-400 hover:text-duo-charcoal dark:hover:text-white'
              }`}
            >
              {tab.icon}
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Gamification Stats, Shop & AI */}
        <div className="flex items-center gap-3 sm:gap-4 font-extrabold text-xs sm:text-sm">
          {/* AI Mascot Trigger */}
          <button
            onClick={onOpenAIChat}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-black text-xs shadow-duo-green hover:brightness-105 transition-transform active:scale-95"
          >
            <Bot className="w-4 h-4" />
            <span>Pytho IA</span>
          </button>

          {/* Streak */}
          <div className="flex items-center gap-1 text-duo-yellow-dark" title="Dias de ofensiva">
            <Flame className="w-4 h-4 fill-duo-yellow text-duo-yellow-dark animate-pulse" />
            <span>{userState.streak}</span>
          </div>

          {/* Gems - Clickable to open Shop */}
          <button
            onClick={onOpenShop}
            className="flex items-center gap-1 text-duo-blue hover:scale-105 transition-transform"
            title="Abrir Loja de Gemas"
          >
            <Gem className="w-4 h-4 fill-duo-blue text-duo-blue-dark" />
            <span>{userState.gems}</span>
          </button>

          {/* Hearts - Clickable to open Shop */}
          <button
            onClick={onOpenShop}
            className="flex items-center gap-1 text-duo-red hover:scale-105 transition-transform"
            title="Recarregar Vidas"
          >
            <Heart className="w-4 h-4 fill-duo-red text-duo-red-dark" />
            <span>{userState.isPro ? '∞' : userState.hearts}</span>
          </button>

          {/* Shop Icon */}
          <button
            onClick={onOpenShop}
            className="p-1.5 rounded-xl border border-duo-border dark:border-slate-700 text-duo-gray dark:text-slate-300 hover:text-duo-charcoal dark:hover:text-white"
            title="Abrir Loja"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>

          {/* Pro Badge */}
          <button
            onClick={onOpenPricing}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-transform active:scale-95 ${
              userState.isPro
                ? 'bg-gradient-to-r from-duo-purple to-indigo-500 text-white shadow-duo-purple'
                : 'bg-duo-yellow text-duo-charcoal hover:brightness-105 shadow-duo-yellow'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{userState.isPro ? 'PRO' : 'PRO'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
