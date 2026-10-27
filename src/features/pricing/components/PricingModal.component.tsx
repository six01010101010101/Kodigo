import React from 'react';
import { X, Check, Crown, Zap, Heart } from 'lucide-react';
import { soundService } from '../../../services/sound.service';

interface PricingModalProps {
  isPro: boolean;
  onClose: () => void;
  onTogglePro: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isPro, onClose, onTogglePro }) => {
  const handleUpgrade = () => {
    soundService.playStreakFanfare();
    onTogglePro();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border-2 border-duo-border dark:border-slate-800 w-full max-w-xl rounded-3xl shadow-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-duo-gray hover:text-duo-charcoal dark:hover:text-white p-1"
        >
          <X className="w-6 h-6 stroke-[2.5]" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-400 to-duo-yellow flex items-center justify-center shadow-duo-yellow mb-3">
            <Crown className="w-8 h-8 text-white fill-white" />
          </div>
          <h2 className="text-2xl font-black text-duo-charcoal dark:text-white">
            Planos & Assinaturas Kodigo
          </h2>
          <p className="text-xs sm:text-sm text-duo-gray dark:text-slate-400 mt-1">
            Aprenda programação de graça ou potencialize seus estudos com o Pro
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
          {/* Plano Gratuito */}
          <div className="border-2 border-duo-border dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between bg-duo-bg-light dark:bg-slate-800/40">
            <div>
              <span className="text-xs font-black uppercase text-duo-gray dark:text-slate-400 tracking-wider">
                Para Sempre
              </span>
              <h3 className="text-xl font-black text-duo-charcoal dark:text-white mt-1">Gratuito</h3>
              <p className="text-2xl font-black text-duo-charcoal dark:text-white my-2">R$ 0</p>
              <ul className="text-xs font-bold text-duo-charcoal dark:text-slate-200 space-y-2 mt-4">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-duo-green" />
                  <span>Trilhas completas de HTML a C++</span>
                </li>
                <li className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-duo-red fill-duo-red" />
                  <span>5 vidas com recarga diária ou anúncio</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-duo-green" />
                  <span>Mascote Pytho com dicas básicas</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Plano Super Pro */}
          <div className="border-2 border-duo-purple rounded-2xl p-5 flex flex-col justify-between bg-purple-50 dark:bg-purple-950/30 shadow-duo-purple relative overflow-hidden">
            <div className="absolute -top-1 -right-1 bg-duo-purple text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-bl-lg">
              Popular
            </div>
            <div>
              <span className="text-xs font-black uppercase text-duo-purple tracking-wider">
                Aceleração Total
              </span>
              <h3 className="text-xl font-black text-duo-purple mt-1">Kodigo Super Pro</h3>
              <p className="text-2xl font-black text-duo-charcoal dark:text-white my-2">
                R$ 19,90 <span className="text-xs text-duo-gray dark:text-slate-400">/mês</span>
              </p>
              <ul className="text-xs font-bold text-duo-charcoal dark:text-slate-200 space-y-2 mt-4">
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-duo-purple fill-duo-purple" />
                  <span>Vidas infinitas (sem interrupções)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-duo-purple" />
                  <span>IA Pytho Copilot ilimitada</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-duo-purple" />
                  <span>Sandbox de código ilimitado</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleUpgrade}
              className="mt-6 w-full py-2.5 rounded-xl bg-duo-purple hover:bg-duo-purple-dark text-white font-black text-xs uppercase tracking-wider shadow-duo-purple transition-transform active:scale-95"
            >
              {isPro ? 'Desativar Modo Pro' : 'Ativar Kodigo Pro'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
