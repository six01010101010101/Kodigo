import React from 'react';
import { Target, CheckCircle2, XCircle, Award, Sparkles } from 'lucide-react';
import { ChallengeHistoryItem, DailyMission, Trophy } from '../history.types';

const SAMPLE_MISSIONS: DailyMission[] = [
  { id: 'm1', title: 'Acerte 5 exercícios seguidos', rewardXp: 30, current: 4, target: 5, completed: false },
  { id: 'm2', title: 'Complete 1 lição na trilha HTML5', rewardXp: 20, current: 1, target: 1, completed: true },
  { id: 'm3', title: 'Execute um código no Sandbox', rewardXp: 15, current: 1, target: 1, completed: true }
];

const SAMPLE_TROPHIES: Trophy[] = [
  { id: 't1', name: 'Primeiros Passos', description: 'Completou a primeira lição de código.', icon: '🎯', unlocked: true },
  { id: 't2', name: 'Mestre do Fogo', description: 'Manteve 7 dias consecutivos de ofensiva.', icon: '🔥', unlocked: true },
  { id: 't3', name: 'Pythonista', description: 'Acertou 10 desafios com o Pytho.', icon: '🐍', unlocked: false }
];

const SAMPLE_HISTORY: ChallengeHistoryItem[] = [
  { id: 'h1', challengeTitle: 'Tag semântica de maior cabeçalho', trackName: 'HTML5', isCorrect: true, selectedAnswer: '<h1>', correctAnswer: '<h1>', date: 'Hoje' },
  { id: 'h2', challengeTitle: 'Elemento semântico de navegação', trackName: 'HTML5', isCorrect: true, selectedAnswer: '<nav>', correctAnswer: '<nav>', date: 'Hoje' },
  { id: 'h3', challengeTitle: 'Alinhamento no eixo principal Flexbox', trackName: 'CSS3', isCorrect: false, selectedAnswer: 'align-items', correctAnswer: 'justify-content', date: 'Ontem' }
];

export const HistoryView: React.FC = () => {
  const correctCount = SAMPLE_HISTORY.filter(h => h.isCorrect).length;
  const accuracy = Math.round((correctCount / SAMPLE_HISTORY.length) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12 animate-fade-in">
      {/* Daily Quests / Missions */}
      <div className="bg-white dark:bg-slate-800 border-2 border-duo-border dark:border-slate-700 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-duo-charcoal dark:text-white font-black text-sm">
          <Target className="w-5 h-5 text-duo-yellow-dark" />
          <h3>Missões Diárias</h3>
        </div>

        <div className="space-y-3">
          {SAMPLE_MISSIONS.map((m) => (
            <div key={m.id} className="p-3.5 rounded-2xl border-2 border-duo-border dark:border-slate-700 bg-duo-bg-light dark:bg-slate-900/50 flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-duo-charcoal dark:text-white">{m.title}</span>
                  <span className="text-xs font-black text-duo-green">+{m.rewardXp} XP</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-duo-yellow h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, (m.current / m.target) * 100)}%` }}
                  />
                </div>
              </div>
              {m.completed && (
                <div className="w-6 h-6 rounded-full bg-duo-green flex items-center justify-center text-white flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Trophies & Achievements */}
      <div className="bg-white dark:bg-slate-800 border-2 border-duo-border dark:border-slate-700 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-duo-charcoal dark:text-white font-black text-sm">
          <Award className="w-5 h-5 text-duo-purple" />
          <h3>Troféus & Conquistas</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SAMPLE_TROPHIES.map((t) => (
            <div
              key={t.id}
              className={`p-4 rounded-2xl border-2 text-center flex flex-col items-center justify-between ${
                t.unlocked
                  ? 'border-duo-purple bg-purple-50/50 dark:bg-slate-900 shadow-duo-purple'
                  : 'border-duo-border dark:border-slate-700 opacity-50 grayscale'
              }`}
            >
              <span className="text-3xl mb-1">{t.icon}</span>
              <h4 className="text-xs font-black text-duo-charcoal dark:text-white">{t.name}</h4>
              <p className="text-[10px] text-duo-gray dark:text-slate-400 mt-1">{t.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Exercise History & Accuracy */}
      <div className="bg-white dark:bg-slate-800 border-2 border-duo-border dark:border-slate-700 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-duo-charcoal dark:text-white font-black text-sm">
            <Sparkles className="w-5 h-5 text-duo-blue" />
            <h3>Histórico de Desafios</h3>
          </div>
          <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-slate-700 text-duo-blue">
            Precisão: {accuracy}%
          </span>
        </div>

        <div className="space-y-2.5">
          {SAMPLE_HISTORY.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-2xl border border-duo-border dark:border-slate-700 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {item.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-duo-green flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-duo-red flex-shrink-0" />
                )}
                <div className="truncate">
                  <p className="font-bold text-duo-charcoal dark:text-white truncate">
                    {item.challengeTitle}
                  </p>
                  <p className="text-[11px] text-duo-gray dark:text-slate-400">
                    Sua resposta: <span className="font-mono font-bold">{item.selectedAnswer}</span>
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-black uppercase text-duo-gray flex-shrink-0">
                {item.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
