import React, { useState } from 'react';
import { X, Heart, Shield, PlayCircle, Gem, CheckCircle, Sparkles } from 'lucide-react';
import { soundService } from '../../../services/sound.service';

interface ShopModalProps {
  gems: number;
  hearts: number;
  maxHearts: number;
  onClose: () => void;
  onBuyHearts: (cost: number, amount: number) => boolean;
  onWatchAdOrPractice: () => void;
  onBuyStreakFreeze: (cost: number) => boolean;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  gems,
  hearts,
  maxHearts,
  onClose,
  onBuyHearts,
  onWatchAdOrPractice,
  onBuyStreakFreeze
}) => {
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adCountdown, setAdCountdown] = useState(5);
  const [message, setMessage] = useState<string | null>(null);

  const handleStartAdOrPractice = () => {
    soundService.playClick();
    setIsWatchingAd(true);
    setAdCountdown(5);

    const interval = setInterval(() => {
      setAdCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsWatchingAd(false);
          soundService.playStreakFanfare();
          onWatchAdOrPractice();
          setMessage('Parabéns! Você ganhou +1 Vida extra por concluir o treino rápido!');
          setTimeout(() => setMessage(null), 4000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleBuy = (type: 'hearts' | 'freeze') => {
    soundService.playClick();
    if (type === 'hearts') {
      const ok = onBuyHearts(150, maxHearts - hearts);
      if (ok) {
        soundService.playStreakFanfare();
        setMessage('Vidas totalmente recarregadas com sucesso!');
      } else {
        setMessage('Gemas insuficientes. Pratique lições para ganhar mais diamantes!');
      }
    } else {
      const ok = onBuyStreakFreeze(200);
      if (ok) {
        soundService.playStreakFanfare();
        setMessage('Bloqueio de Ofensiva ativado para proteger seus dias consecutivos!');
      } else {
        setMessage('Gemas insuficientes para o Bloqueio de Ofensiva.');
      }
    }
    setTimeout(() => setMessage(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border-2 border-duo-border dark:border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-duo-gray hover:text-duo-charcoal dark:hover:text-white p-1"
        >
          <X className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-duo-border dark:border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-duo-blue/10 flex items-center justify-center text-duo-blue">
              <Gem className="w-6 h-6 fill-duo-blue" />
            </div>
            <div>
              <h3 className="font-black text-lg text-duo-charcoal dark:text-white">Loja Kodigo</h3>
              <p className="text-xs text-duo-gray dark:text-slate-400">Troque suas gemas ou recarregue vidas</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-blue-50 dark:bg-slate-800 text-duo-blue font-black text-sm">
            <Gem className="w-4 h-4 fill-duo-blue" />
            <span>{gems}</span>
          </div>
        </div>

        {message && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-duo-green text-xs font-bold text-duo-green flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* Items Grid */}
        <div className="space-y-3">
          {/* Ad / Quick Practice for Free Heart */}
          <div className="p-4 rounded-2xl border-2 border-duo-border dark:border-slate-800 flex items-center justify-between gap-3 bg-duo-bg-light dark:bg-slate-800/40">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-duo-red/10 flex items-center justify-center text-duo-red flex-shrink-0">
                <Heart className="w-6 h-6 fill-duo-red" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-duo-charcoal dark:text-white">
                  Treino Rápido / Anúncio
                </h4>
                <p className="text-[11px] text-duo-gray dark:text-slate-400">
                  Ganhe +1 Vida de graça sem gastar gemas
                </p>
              </div>
            </div>

            <button
              onClick={handleStartAdOrPractice}
              disabled={isWatchingAd || hearts >= maxHearts}
              className="px-3.5 py-2 rounded-xl bg-duo-green hover:bg-duo-green-dark disabled:bg-gray-200 dark:disabled:bg-slate-700 text-white font-black text-xs uppercase tracking-wider shadow-duo-green transition-transform active:scale-95 flex items-center gap-1.5 flex-shrink-0"
            >
              <PlayCircle className="w-4 h-4" />
              <span>{isWatchingAd ? `Aguarde (${adCountdown}s)` : hearts >= maxHearts ? 'Cheio' : 'Assistir (+1)'}</span>
            </button>
          </div>

          {/* Full Heart Refill with Gems */}
          <div className="p-4 rounded-2xl border-2 border-duo-border dark:border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-duo-blue/10 flex items-center justify-center text-duo-blue flex-shrink-0">
                <Sparkles className="w-6 h-6 text-duo-blue" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-duo-charcoal dark:text-white">
                  Recarga Total de Vidas
                </h4>
                <p className="text-[11px] text-duo-gray dark:text-slate-400">
                  Restaure seus 5 corações instantaneamente
                </p>
              </div>
            </div>

            <button
              onClick={() => handleBuy('hearts')}
              disabled={gems < 150 || hearts >= maxHearts}
              className="px-3.5 py-2 rounded-xl bg-duo-blue hover:bg-duo-blue-dark disabled:bg-gray-200 dark:disabled:bg-slate-700 text-white font-black text-xs uppercase tracking-wider shadow-duo-blue transition-transform active:scale-95 flex items-center gap-1.5 flex-shrink-0"
            >
              <Gem className="w-3.5 h-3.5 fill-white" />
              <span>150 Gemas</span>
            </button>
          </div>

          {/* Streak Freeze */}
          <div className="p-4 rounded-2xl border-2 border-duo-border dark:border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 flex-shrink-0">
                <Shield className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-duo-charcoal dark:text-white">
                  Bloqueio de Ofensiva
                </h4>
                <p className="text-[11px] text-duo-gray dark:text-slate-400">
                  Protege sua sequência de dias caso fique sem praticar
                </p>
              </div>
            </div>

            <button
              onClick={() => handleBuy('freeze')}
              disabled={gems < 200}
              className="px-3.5 py-2 rounded-xl bg-duo-yellow text-duo-charcoal hover:brightness-105 disabled:bg-gray-200 dark:disabled:bg-slate-700 font-black text-xs uppercase tracking-wider shadow-duo-yellow transition-transform active:scale-95 flex items-center gap-1.5 flex-shrink-0"
            >
              <Gem className="w-3.5 h-3.5 fill-duo-charcoal" />
              <span>200 Gemas</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
