import React from 'react';
import { Trophy, Flame, ArrowUp } from 'lucide-react';

interface LeaderboardUser {
  rank: number;
  name: string;
  xp: number;
  isCurrentUser?: boolean;
  avatar: string;
}

const LEADERBOARD_DATA: LeaderboardUser[] = [
  { rank: 1, name: 'Lucas Dev', xp: 840, avatar: '🥇' },
  { rank: 2, name: 'Ken Kobayashi', xp: 520, isCurrentUser: true, avatar: '🥈' },
  { rank: 3, name: 'Mariana Silva', xp: 480, avatar: '🥉' },
  { rank: 4, name: 'Carlos Tech', xp: 390, avatar: '⚡' },
  { rank: 5, name: 'Beatriz Costa', xp: 310, avatar: '💻' }
];

export const LeaderboardView: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* League Banner */}
      <div className="bg-gradient-to-r from-amber-400 to-amber-500 rounded-3xl p-6 text-white shadow-duo-yellow flex items-center justify-between">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-amber-100">
            Divisão Semanal
          </span>
          <h2 className="text-2xl font-black">Liga Ouro</h2>
          <p className="text-xs text-amber-100 mt-1 flex items-center gap-1">
            <ArrowUp className="w-3.5 h-3.5 stroke-[3]" />
            Os 3 primeiros sobem para a Liga Diamante!
          </p>
        </div>
        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <Trophy className="w-10 h-10 text-white fill-white" />
        </div>
      </div>

      {/* 3D Podium */}
      <div className="bg-white dark:bg-slate-800 border-2 border-duo-border dark:border-slate-700 rounded-3xl p-6 shadow-sm">
        <div className="flex items-end justify-center gap-4 pt-6 pb-4">
          {/* 2nd Place */}
          <div className="flex flex-col items-center">
            <span className="text-2xl mb-1">{LEADERBOARD_DATA[1].avatar}</span>
            <span className="text-xs font-black text-duo-charcoal dark:text-white truncate max-w-[80px]">
              {LEADERBOARD_DATA[1].name}
            </span>
            <span className="text-[11px] font-black text-duo-green">{LEADERBOARD_DATA[1].xp} XP</span>
            <div className="w-20 sm:w-24 h-20 bg-slate-200 dark:bg-slate-700 rounded-t-2xl flex items-center justify-center font-black text-slate-500 mt-2 shadow-duo-gray">
              2º
            </div>
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center">
            <span className="text-3xl mb-1 animate-bounce">{LEADERBOARD_DATA[0].avatar}</span>
            <span className="text-xs font-black text-duo-charcoal dark:text-white truncate max-w-[90px]">
              {LEADERBOARD_DATA[0].name}
            </span>
            <span className="text-[11px] font-black text-duo-green">{LEADERBOARD_DATA[0].xp} XP</span>
            <div className="w-24 sm:w-28 h-28 bg-amber-400 rounded-t-2xl flex items-center justify-center font-black text-white text-xl mt-2 shadow-duo-yellow">
              1º
            </div>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center">
            <span className="text-2xl mb-1">{LEADERBOARD_DATA[2].avatar}</span>
            <span className="text-xs font-black text-duo-charcoal dark:text-white truncate max-w-[80px]">
              {LEADERBOARD_DATA[2].name}
            </span>
            <span className="text-[11px] font-black text-duo-green">{LEADERBOARD_DATA[2].xp} XP</span>
            <div className="w-20 sm:w-24 h-16 bg-amber-700/30 rounded-t-2xl flex items-center justify-center font-black text-amber-800 dark:text-amber-200 mt-2">
              3º
            </div>
          </div>
        </div>

        {/* Full Table */}
        <div className="mt-6 space-y-2 border-t border-duo-border dark:border-slate-700 pt-4">
          {LEADERBOARD_DATA.map((player) => (
            <div
              key={player.rank}
              className={`p-3 rounded-2xl flex items-center justify-between transition-all ${
                player.isCurrentUser
                  ? 'bg-green-50 dark:bg-emerald-950/40 border-2 border-duo-green shadow-duo-green'
                  : 'border border-duo-border dark:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 text-center font-black text-xs text-duo-gray dark:text-slate-400">
                  {player.rank}
                </span>
                <span className="text-lg">{player.avatar}</span>
                <span className="text-xs font-extrabold text-duo-charcoal dark:text-white">
                  {player.name} {player.isCurrentUser && '(Você)'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-black text-duo-green">
                <Flame className="w-4 h-4 fill-duo-green text-duo-green" />
                <span>{player.xp} XP</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
