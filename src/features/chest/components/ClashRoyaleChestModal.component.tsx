import React, { useState } from 'react';
import { Sparkles, Check, ChevronRight } from 'lucide-react';
import { ChestRewardItem, ChestRewardSummary } from '../types/chest.types';
import { ClashChestGraphic } from './ClashChestGraphic.component';
import { chestService } from '../services/chest.service';
import { soundService } from '../../../services/sound.service';

interface ClashRoyaleChestModalProps {
  unitId: string;
  unitTitle: string;
  onClose: () => void;
  onClaim: (summary: ChestRewardSummary) => void;
}

export const ClashRoyaleChestModal: React.FC<ClashRoyaleChestModalProps> = ({
  unitId,
  unitTitle,
  onClose,
  onClaim,
}) => {
  const [rewards] = useState<ChestRewardItem[]>(() =>
    chestService.generateUnitRewards(unitId, unitTitle)
  );
  const [chestState, setChestState] = useState<'closed' | 'rumbling' | 'open'>('closed');
  const [revealedIndex, setRevealedIndex] = useState<number>(-1);
  const [isFinished, setIsFinished] = useState(false);

  const handleChestTap = () => {
    if (chestState === 'closed') {
      soundService.playChestRumble();
      setChestState('rumbling');
      setTimeout(() => {
        soundService.playChestBurst();
        setChestState('open');
        revealNextCard(0);
      }, 700);
    } else if (chestState === 'open' && !isFinished) {
      revealNextCard(revealedIndex + 1);
    }
  };

  const revealNextCard = (nextIndex: number) => {
    if (nextIndex < rewards.length) {
      setRevealedIndex(nextIndex);
      const currentReward = rewards[nextIndex];
      soundService.playCardReveal(currentReward.rarity);
    } else {
      setIsFinished(true);
      soundService.playStreakFanfare();
      chestService.markChestOpened(unitId);
    }
  };

  const handleFinish = () => {
    const summary = chestService.summarizeRewards(rewards);
    onClaim(summary);
    onClose();
  };

  const currentReward = revealedIndex >= 0 && revealedIndex < rewards.length ? rewards[revealedIndex] : null;
  const cardsRemaining = rewards.length - 1 - revealedIndex;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-fade-in select-none">
      {/* Golden Sunburst / God Rays Background */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-yellow-500/10 via-amber-400/20 to-orange-500/10 blur-3xl animate-pulse pointer-events-none" />

      {/* Header Info */}
      <div className="relative text-center mb-6 z-10">
        <span className="text-xs font-black uppercase tracking-widest text-amber-400 flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
          <span>Baú de Recompensas</span>
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white drop-shadow-md mt-1">
          {unitTitle}
        </h2>
        {chestState === 'open' && !isFinished && (
          <span className="inline-block mt-2 px-3 py-1 bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black rounded-full animate-bounce">
            {cardsRemaining > 0 ? `${cardsRemaining} recompensa(s) restantes!` : 'Última recompensa!'}
          </span>
        )}
      </div>

      {/* Main Chest Stage or Revealed Card Display */}
      <div className="relative z-10 flex flex-col items-center justify-center my-4 min-h-[260px]">
        {!isFinished && (!currentReward || chestState !== 'open') ? (
          <div className="flex flex-col items-center cursor-pointer" onClick={handleChestTap}>
            <ClashChestGraphic state={chestState} size="lg" />
            <p className="mt-6 text-sm font-black text-amber-200 animate-pulse tracking-wide bg-amber-950/60 px-5 py-2 rounded-2xl border border-amber-500/30">
              {chestState === 'closed' ? '👆 Toque no Baú para Abrir!' : 'Abrindo baú...'}
            </p>
          </div>
        ) : !isFinished && currentReward ? (
          <div
            onClick={handleChestTap}
            className="flex flex-col items-center cursor-pointer animate-scale-up"
          >
            {/* Clash Royale Reward Card */}
            <div className={`w-64 p-5 rounded-3xl bg-gradient-to-b ${currentReward.color} border-4 border-white shadow-2xl flex flex-col items-center text-center transform hover:scale-105 transition-transform`}>
              <span className="text-6xl my-2 drop-shadow-lg filter">{currentReward.icon}</span>
              <span className="text-[11px] font-black uppercase text-white/80 tracking-wider">
                {currentReward.rarity}
              </span>
              <h3 className="text-xl font-black text-white mt-1 drop-shadow-sm">
                +{currentReward.amount} {currentReward.title}
              </h3>
              <p className="text-xs font-bold text-white/90 mt-2 bg-black/20 p-2 rounded-xl">
                {currentReward.description}
              </p>
            </div>
            <button
              onClick={handleChestTap}
              className="mt-6 px-6 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-sm flex items-center gap-2 shadow-lg active:translate-y-1 transition-all"
            >
              <span>{cardsRemaining > 0 ? 'Toque para a Próxima' : 'Ver Todas as Recompensas'}</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        ) : (
          /* Finished Summary Grid */
          <div className="flex flex-col items-center max-w-md w-full bg-slate-900/90 border-2 border-amber-400/50 rounded-3xl p-6 shadow-2xl animate-fade-in">
            <span className="text-4xl mb-2">🎉</span>
            <h3 className="text-xl font-black text-white text-center">Todas as Recompensas Coletadas!</h3>
            <p className="text-xs text-amber-300 text-center mt-1 mb-4">Adicionadas instantaneamente à sua conta!</p>

            <div className="grid grid-cols-2 gap-2.5 w-full mb-6">
              {rewards.map((r) => (
                <div key={r.id} className="p-3 bg-slate-800 rounded-2xl border border-slate-700 flex items-center gap-3">
                  <span className="text-2xl">{r.icon}</span>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-black text-white truncate">+{r.amount}</span>
                    <span className="text-[10px] text-slate-300 font-bold truncate">{r.title}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black rounded-2xl shadow-duo-green flex items-center justify-center gap-2 active:translate-y-1 transition-all"
            >
              <Check className="w-5 h-5 stroke-[3]" />
              <span>Coletar Recompensas e Continuar</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
