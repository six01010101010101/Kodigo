import React, { useState } from 'react';
import { Header } from './components/common/Header.component';
import { PathTrail } from './features/path/components/PathTrail.component';
import { KodiMascot } from './features/mascot/components/KodiMascot.component';
import { LessonModal } from './features/lesson/components/LessonModal.component';
import { PricingModal } from './features/pricing/components/PricingModal.component';
import { TracksModal } from './features/tracks/components/TracksModal.component';
import { CodePlayground } from './features/runner/components/CodePlayground.component';
import { INITIAL_TRACKS, HTML_CSS_UNITS } from './services/course.data';
import { UserGamificationState, Lesson, CodeTrack } from './types/kodigo.types';

export const App: React.FC = () => {
  const [tracks] = useState<CodeTrack[]>(INITIAL_TRACKS);
  const [activeTrack, setActiveTrack] = useState<CodeTrack>(INITIAL_TRACKS[0]);
  const [units, setUnits] = useState(HTML_CSS_UNITS);

  const [userState, setUserState] = useState<UserGamificationState>({
    hearts: 5,
    maxHearts: 5,
    xp: 140,
    gems: 320,
    streak: 7,
    activeTrackId: INITIAL_TRACKS[0].id,
    isPro: false
  });

  const [activeLesson, setActiveLesson] = useState<{ lesson: Lesson; unitTitle: string } | null>(null);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isTracksOpen, setIsTracksOpen] = useState(false);
  const [mascotTip, setMascotTip] = useState('Pronto para aprender? Complete lições diárias para manter a ofensiva!');

  const handleSelectLesson = (lesson: Lesson, unitTitle: string) => {
    if (userState.hearts <= 0 && !userState.isPro) {
      setIsPricingOpen(true);
      return;
    }
    setActiveLesson({ lesson, unitTitle });
  };

  const handleLessonComplete = (xpEarned: number) => {
    if (!activeLesson) return;
    setUserState((prev) => ({
      ...prev,
      xp: prev.xp + xpEarned,
      gems: prev.gems + 15
    }));
    setUnits((prev) =>
      prev.map((unit) => ({
        ...unit,
        lessons: unit.lessons.map((l) =>
          l.id === activeLesson.lesson.id ? { ...l, completed: true } : l
        )
      }))
    );
    setMascotTip(`Excelente trabalho! Você ganhou +${xpEarned} XP e manteve o ritmo.`);
    setActiveLesson(null);
  };

  const handleLoseHeart = () => {
    if (userState.isPro) return;
    setUserState((prev) => ({
      ...prev,
      hearts: Math.max(0, prev.hearts - 1)
    }));
  };

  const handleTogglePro = () => {
    setUserState((prev) => ({
      ...prev,
      isPro: !prev.isPro,
      hearts: 5
    }));
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col font-sans">
      <Header
        userState={userState}
        activeTrack={activeTrack}
        onOpenPricing={() => setIsPricingOpen(true)}
        onOpenTracks={() => setIsTracksOpen(true)}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        {/* Banner with Mascot */}
        <div className="bg-white border-2 border-duo-border rounded-3xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <KodiMascot
            emotion="idle"
            speechText={mascotTip}
            onMascotClick={() => setMascotTip('Sabia que programar 15 minutos por dia é mais eficaz que horas apenas no fim de semana?')}
          />
          <div className="text-right flex flex-col items-center sm:items-end">
            <span className="text-xs font-black uppercase tracking-wider text-duo-green">
              Trilha Ativa
            </span>
            <span className="text-lg font-black text-duo-charcoal">
              {activeTrack.name}
            </span>
            <span className="text-xs text-duo-gray mt-1">
              {units.reduce((acc, u) => acc + u.lessons.filter((l) => l.completed).length, 0)} de{' '}
              {units.reduce((acc, u) => acc + u.lessons.length, 0)} lições concluídas
            </span>
          </div>
        </div>

        {/* Duolingo-style Learning Path */}
        <PathTrail units={units} onSelectLesson={handleSelectLesson} />

        {/* Live Code Sandbox */}
        <CodePlayground />
      </main>

      {/* Modals */}
      {activeLesson && (
        <LessonModal
          lesson={activeLesson.lesson}
          unitTitle={activeLesson.unitTitle}
          onClose={() => setActiveLesson(null)}
          onComplete={handleLessonComplete}
          onLoseHeart={handleLoseHeart}
        />
      )}

      {isPricingOpen && (
        <PricingModal
          isPro={userState.isPro}
          onClose={() => setIsPricingOpen(false)}
          onTogglePro={handleTogglePro}
        />
      )}

      {isTracksOpen && (
        <TracksModal
          tracks={tracks}
          activeTrackId={activeTrack.id}
          onClose={() => setIsTracksOpen(false)}
          onSelectTrack={(t) => setActiveTrack(t)}
        />
      )}
    </div>
  );
};

export default App;
