import React, { useState, useEffect } from 'react';
import { Header, MainNavTab } from './components/common/Header.component';
import { PathTrail } from './features/path/components/PathTrail.component';
import { PythoMascot } from './features/mascot/components/PythoMascot.component';
import { LessonModal } from './features/lesson/components/LessonModal.component';
import { PricingModal } from './features/pricing/components/PricingModal.component';
import { TracksModal } from './features/tracks/components/TracksModal.component';
import { CodePlayground } from './features/runner/components/CodePlayground.component';
import { HistoryView } from './features/history/components/HistoryView.component';
import { LeaderboardView } from './features/leaderboard/components/LeaderboardView.component';
import { ProfileView } from './features/profile/components/ProfileView.component';
import { AIChatDrawer } from './features/ai-chat/components/AIChatDrawer.component';
import { AuthHub } from './features/auth/components/AuthHub.component';
import { authService } from './features/auth/auth.service';
import { AuthUser } from './features/auth/auth.types';
import { themeService } from './features/theme/theme.service';
import { AppTheme } from './features/theme/theme.types';
import { INITIAL_TRACKS, HTML_CSS_UNITS } from './services/course.data';
import { UserGamificationState, Lesson, CodeTrack } from './types/kodigo.types';

export const App: React.FC = () => {
  const [user, setUser] = useState<AuthUser | null>(() => authService.getCurrentUser());
  const [isGuest, setIsGuest] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<AppTheme>(() => themeService.getTheme());
  const [activeTab, setActiveTab] = useState<MainNavTab>('learn');
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  const [tracks] = useState<CodeTrack[]>(INITIAL_TRACKS);
  const [activeTrack, setActiveTrack] = useState<CodeTrack>(INITIAL_TRACKS[0]);
  const [units, setUnits] = useState(HTML_CSS_UNITS);

  const [userState, setUserState] = useState<UserGamificationState>({
    hearts: 5,
    maxHearts: 5,
    xp: 220,
    gems: 450,
    streak: 8,
    activeTrackId: INITIAL_TRACKS[0].id,
    isPro: false
  });

  const [activeLesson, setActiveLesson] = useState<{ lesson: Lesson; unitTitle: string } | null>(null);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isTracksOpen, setIsTracksOpen] = useState(false);
  const [mascotTip, setMascotTip] = useState('Sssss! Vamos dominar programação do zero ao avançado!');

  useEffect(() => {
    themeService.init();
  }, []);

  const handleChangeTheme = (t: AppTheme) => {
    setCurrentTheme(t);
    themeService.setTheme(t);
  };

  const handleLessonComplete = (xpEarned: number) => {
    if (!activeLesson) return;
    setUserState((prev) => ({ ...prev, xp: prev.xp + xpEarned, gems: prev.gems + 20 }));
    setUnits((prev) =>
      prev.map((unit) => ({
        ...unit,
        lessons: unit.lessons.map((l) => (l.id === activeLesson.lesson.id ? { ...l, completed: true } : l))
      }))
    );
    setMascotTip(`Sssssensacional! +${xpEarned} XP adicionados na sua jornada!`);
    setActiveLesson(null);
  };

  if (!user && !isGuest) {
    return (
      <AuthHub
        onAuthenticated={(usr) => setUser(usr)}
        onExploreAsGuest={() => setIsGuest(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] dark:bg-slate-950 text-duo-charcoal dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Header
        userState={userState}
        activeTrack={activeTrack}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onOpenPricing={() => setIsPricingOpen(true)}
        onOpenTracks={() => setIsTracksOpen(true)}
        onOpenAIChat={() => setIsAIChatOpen(true)}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        {activeTab === 'learn' && (
          <>
            <div className="bg-white dark:bg-slate-900 border-2 border-duo-border dark:border-slate-800 rounded-3xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
              <PythoMascot
                emotion="idle"
                speechText={mascotTip}
                onMascotClick={() => setMascotTip('Sabia que o Python foi batizado em homenagem ao grupo Monty Python?')}
              />
              <div className="text-right flex flex-col items-center sm:items-end">
                <span className="text-xs font-black uppercase tracking-wider text-duo-green">Trilha Ativa</span>
                <span className="text-lg font-black">{activeTrack.name}</span>
                <span className="text-xs text-duo-gray dark:text-slate-400 mt-1">
                  {units.reduce((acc, u) => acc + u.lessons.filter((l) => l.completed).length, 0)} de{' '}
                  {units.reduce((acc, u) => acc + u.lessons.length, 0)} lições concluídas
                </span>
              </div>
            </div>
            <PathTrail
              units={units}
              onSelectLesson={(l, title) => {
                if (userState.hearts <= 0 && !userState.isPro) {
                  setIsPricingOpen(true);
                  return;
                }
                setActiveLesson({ lesson: l, unitTitle: title });
              }}
            />
            <CodePlayground />
          </>
        )}

        {activeTab === 'missions' && <HistoryView />}
        {activeTab === 'ranking' && <LeaderboardView />}
        {activeTab === 'profile' && (
          <ProfileView
            user={user}
            currentTheme={currentTheme}
            onChangeTheme={handleChangeTheme}
            onLogout={() => {
              authService.logout();
              setUser(null);
              setIsGuest(false);
            }}
          />
        )}
      </main>

      {/* Modals & AI Chat Drawer */}
      {activeLesson && (
        <LessonModal
          lesson={activeLesson.lesson}
          unitTitle={activeLesson.unitTitle}
          onClose={() => setActiveLesson(null)}
          onComplete={handleLessonComplete}
          onLoseHeart={() => {
            if (!userState.isPro) {
              setUserState((prev) => ({ ...prev, hearts: Math.max(0, prev.hearts - 1) }));
            }
          }}
        />
      )}

      {isPricingOpen && (
        <PricingModal
          isPro={userState.isPro}
          onClose={() => setIsPricingOpen(false)}
          onTogglePro={() => setUserState((p) => ({ ...p, isPro: !p.isPro, hearts: 5 }))}
        />
      )}

      {isTracksOpen && (
        <TracksModal
          tracks={tracks}
          activeTrackId={activeTrack.id}
          onClose={() => setIsTracksOpen(false)}
          onSelectTrack={setActiveTrack}
        />
      )}

      <AIChatDrawer isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
    </div>
  );
};

export default App;
