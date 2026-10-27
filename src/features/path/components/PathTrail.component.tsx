import React from 'react';
import { Check, Star, Lock, BookOpen } from 'lucide-react';
import { Unit, Lesson } from '../../../types/kodigo.types';

interface PathTrailProps {
  units: Unit[];
  onSelectLesson: (lesson: Lesson, unitTitle: string) => void;
}

export const PathTrail: React.FC<PathTrailProps> = ({ units, onSelectLesson }) => {
  return (
    <div className="flex flex-col items-center py-6 w-full max-w-xl mx-auto">
      {units.map((unit) => (
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

            {/* End of Unit Milestone Chest */}
            <div className="mt-4 flex flex-col items-center">
              <div className="w-16 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-duo-yellow border-2 border-amber-300">
                <span className="text-2xl">🎁</span>
              </div>
              <span className="text-[11px] font-black uppercase text-amber-700 dark:text-amber-400 mt-1 font-mono">
                Baú de XP
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
