import React, { useState, useEffect } from 'react';
import { Header, MainNavTab } from './components/common/Header.component';
import { PathTrail } from './features/path/components/PathTrail.component';
import { PythoMascot } from './features/mascot/components/PythoMascot.component';
import { LessonModal } from './features/lesson/components/LessonModal.component';
import { PricingModal } from './features/pricing/components/PricingModal.component';
import { TracksModal } from './features/tracks/components/TracksModal.component';
import { ShopModal } from './features/shop/components/ShopModal.component';
import { CodePlayground } from './features/runner/components/CodePlayground.component';
import { HistoryView } from './features/history/components/HistoryView.component';
import { LeaderboardView } from './features/leaderboard/components/LeaderboardView.component';
import { ProfileView } from './features/profile/components/ProfileView.component';
import { AIChatDrawer } from './features/ai-chat/components/AIChatDrawer.component';
import { ClashRoyaleChestModal } from './features/chest/components/ClashRoyaleChestModal.component';
import { ChestRewardSummary } from './features/chest/types/chest.types';
import { AuthHub } from './features/auth/components/AuthHub.component';
import { authService } from './features/auth/auth.service';
import { AuthUser } from './features/auth/auth.types';
import { themeService } from './features/theme/theme.service';
import { AppTheme } from './features/theme/theme.types';
import { SIX_LEVEL_TRACKS, SERIOUS_UNITS } from './services/curriculum.data';
import { UserGamificationState, Lesson, CodeTrack, Unit } from './types/kodigo.types';

export const App: React.FC = () => {
  const [user, setUser] = useState<AuthUser | null>(() => authService.getCurrentUser());
  const [isGuest, setIsGuest] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<AppTheme>(() => themeService.getTheme());
  const [activeTab, setActiveTab] = useState<MainNavTab>('learn');
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isTracksOpen, setIsTracksOpen] = useState(false);
  const [activeChestUnit, setActiveChestUnit] = useState<Unit | null>(null);

  const [tracks] = useState<CodeTrack[]>(SIX_LEVEL_TRACKS);
  const [activeTrack, setActiveTrack] = useState<CodeTrack>(SIX_LEVEL_TRACKS[0]);
  const [units, setUnits] = useState(SERIOUS_UNITS);

  const [userState, setUserState] = useState<UserGamificationState>({
    hearts: 5,
    maxHearts: 5,
    xp: 280,
    gems: 480,
    streak: 9,
    activeTrackId: SIX_LEVEL_TRACKS[0].id,
    isPro: false
  });

  const [activeLesson, setActiveLesson] = useState<{ lesson: Lesson; unitTitle: string } | null>(null);
  const [mascotTip, setMascotTip] = useState('Sssss! Vamos dominar engenharia de software do zero ao profissional!');

  useEffect(() => { themeService.init(); }, []);

  const handleChangeTheme = (t: AppTheme) => {
    setCurrentTheme(t);
    themeService.setTheme(t);
  };

  const handleLessonComplete = (xpEarned: number) => {
    if (!activeLesson) return;
    setUserState((prev) => ({ ...prev, xp: prev.xp + xpEarned, gems: prev.gems + 25 }));
    setUnits((prev) =>
      prev.map((unit) => ({
        ...unit,
        lessons: unit.lessons.map((l) => (l.id === activeLesson.lesson.id ? { ...l, completed: true } : l))
      }))
    );
    setMascotTip(`Sssssensacional! +${xpEarned} XP adicionados na sua jornada!`);
    setActiveLesson(null);
  };

  const handleChestClaim = (summary: ChestRewardSummary) => {
    setUserState((prev) => ({
      ...prev,
      xp: prev.xp + summary.totalXp,
      gems: prev.gems + summary.totalGems,
    }));
    setMascotTip(`🏆 Baú Lendário Aberto! +${summary.totalXp} XP, +${summary.totalGems} Gemas e nova missão desbloqueada!`);
    setActiveChestUnit(null);
  };

  if (!user && !isGuest) {
    return <AuthHub onAuthenticated={(usr) => setUser(usr)} onExploreAsGuest={() => setIsGuest(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Header
        userState={userState}
        activeTrack={activeTrack}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onOpenPricing={() => setIsPricingOpen(true)}
        onOpenTracks={() => setIsTracksOpen(true)}
        onOpenAIChat={() => setIsAIChatOpen(true)}
        onOpenShop={() => setIsShopOpen(true)}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        {activeTab === 'learn' && (
          <>
            <div className="bg-white dark:bg-slate-900 border-2 border-duo-border dark:border-slate-800 rounded-3xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
              <PythoMascot
                emotion="idle"
                speechText={mascotTip}
                onMascotClick={() => setMascotTip('Dica de engenharia: use sempre linters e tipagem estrita para evitar 80% dos bugs em produção!')}
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
                  setIsShopOpen(true);
                  return;
                }
                setActiveLesson({ lesson: l, unitTitle: title });
              }}
              onOpenChest={(u) => setActiveChestUnit(u)}
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
            onLogout={() => { authService.logout(); setUser(null); setIsGuest(false); }}
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
            if (!userState.isPro) setUserState((prev) => ({ ...prev, hearts: Math.max(0, prev.hearts - 1) }));
          }}
        />
      )}

      {isPricingOpen && (
        <PricingModal isPro={userState.isPro} onClose={() => setIsPricingOpen(false)} onTogglePro={() => setUserState((p) => ({ ...p, isPro: !p.isPro, hearts: 5 }))} />
      )}

      {isShopOpen && (
        <ShopModal
          gems={userState.gems}
          hearts={userState.hearts}
          maxHearts={userState.maxHearts}
          onClose={() => setIsShopOpen(false)}
          onBuyHearts={(cost, amount) => {
            if (userState.gems >= cost) {
              setUserState((prev) => ({ ...prev, gems: prev.gems - cost, hearts: prev.hearts + amount }));
              return true;
            }
            return false;
          }}
          onWatchAdOrPractice={() => setUserState((prev) => ({ ...prev, hearts: Math.min(prev.maxHearts, prev.hearts + 1) }))}
          onBuyStreakFreeze={(cost) => {
            if (userState.gems >= cost) {
              setUserState((prev) => ({ ...prev, gems: prev.gems - cost }));
              return true;
            }
            return false;
          }}
        />
      )}

      {isTracksOpen && (
        <TracksModal tracks={tracks} activeTrackId={activeTrack.id} onClose={() => setIsTracksOpen(false)} onSelectTrack={setActiveTrack} />
      )}

      {activeChestUnit && (
        <ClashRoyaleChestModal
          unitId={activeChestUnit.id}
          unitTitle={activeChestUnit.title}
          onClose={() => setActiveChestUnit(null)}
          onClaim={handleChestClaim}
        />
      )}

      <AIChatDrawer isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
    </div>
  );
};

export default App;
