import React from 'react';
import { Check, Star, Lock, BookOpen, Sparkles } from 'lucide-react';
import { Unit, Lesson } from '../../../types/kodigo.types';
import { chestService } from '../../chest/services/chest.service';

interface PathTrailProps {
  units: Unit[];
  onSelectLesson: (lesson: Lesson, unitTitle: string) => void;
  onOpenChest?: (unit: Unit) => void;
}

export const PathTrail: React.FC<PathTrailProps> = ({ units, onSelectLesson, onOpenChest }) => {
  return (
    <div className="flex flex-col items-center py-6 w-full max-w-xl mx-auto">
      {units.map((unit) => {
        const isChestOpened = chestService.isChestOpened(unit.id);

        return (
          <div key={unit.id} className="w-full mb-12">
            {/* Unit Header Card */}
            <div className="bg-duo-green text-white p-5 rounded-2xl shadow-duo-green mb-8 flex items-center justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-green-100">
                  Seção {unit.order}
                </span>
                <h2 className="text-lg font-black">{unit.title}</h2>
                <p className="text-xs text-green-50 mt-1">{unit.description}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Stepping Path Nodes */}
            <div className="flex flex-col items-center gap-6">
              {unit.lessons.length === 0 ? (
                <div className="p-4 rounded-xl border-2 border-dashed border-duo-border dark:border-slate-800 text-center text-xs font-bold text-duo-gray dark:text-slate-400">
                  Desafios práticos sendo preparados para este nível
                </div>
              ) : (
                unit.lessons.map((lesson, lessonIndex) => {
                  const offsets = [0, 40, 0, -40];
                  const offsetX = offsets[lessonIndex % offsets.length];

                  return (
                    <div
                      key={lesson.id}
                      style={{ transform: `translateX(${offsetX}px)` }}
                      className="relative flex flex-col items-center"
                    >
                      <button
                        onClick={() => onSelectLesson(lesson, unit.title)}
                        className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                          lesson.completed
                            ? 'bg-duo-yellow shadow-duo-yellow text-duo-charcoal'
                            : unit.isLocked
                            ? 'bg-gray-200 dark:bg-slate-800 shadow-duo-gray dark:shadow-duo-dark text-gray-400 dark:text-slate-600 cursor-not-allowed'
                            : 'bg-duo-green shadow-duo-green text-white animate-pulse'
                        }`}
                      >
                        {lesson.completed ? (
                          <Check className="w-10 h-10 stroke-[3.5]" />
                        ) : unit.isLocked ? (
                          <Lock className="w-8 h-8" />
                        ) : (
                          <Star className="w-9 h-9 fill-white stroke-[2.5]" />
                        )}
                      </button>

                      <span className="text-xs font-black text-duo-charcoal dark:text-slate-200 mt-2 max-w-[150px] text-center truncate">
                        {lesson.title}
                      </span>
                    </div>
                  );
                })
              )}

              {/* End of Unit Milestone Chest (Clash Royale Style) */}
              <div className="mt-4 flex flex-col items-center">
                <button
                  disabled={unit.isLocked || isChestOpened}
                  onClick={() => onOpenChest?.(unit)}
                  className={`group relative w-20 h-18 py-2 px-3 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 transform ${
                    isChestOpened
                      ? 'bg-amber-100 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-800 opacity-80 cursor-default'
                      : unit.isLocked
                      ? 'bg-gray-200 dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-700 opacity-50 cursor-not-allowed'
                      : 'bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 shadow-duo-yellow border-2 border-amber-200 hover:scale-110 active:scale-95 animate-bounce'
                  }`}
                >
                  <span className="text-3xl filter drop-shadow">
                    {isChestOpened ? '📦' : '🎁'}
                  </span>
                  {!isChestOpened && !unit.isLocked && (
                    <Sparkles className="w-4 h-4 text-amber-900 absolute -top-1 -right-1 animate-spin" />
                  )}
                </button>
                <span className={`text-[11px] font-black uppercase mt-1.5 font-mono ${
                  isChestOpened ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'
                }`}>
                  {isChestOpened ? '✨ Recompensas Coletadas' : unit.isLocked ? '🔒 Baú Bloqueado' : '⚡ Abrir Baú de XP!'}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
