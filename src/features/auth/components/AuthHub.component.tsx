import React, { useState } from 'react';
import { Mail, Lock, Github, Chrome, ArrowRight, ShieldCheck } from 'lucide-react';
import { authService } from '../auth.service';
import { AuthUser } from '../auth.types';
import { PythoMascot } from '../../mascot/components/PythoMascot.component';
import { soundService } from '../../../services/sound.service';

interface AuthHubProps {
  onAuthenticated: (user: AuthUser) => void;
  onExploreAsGuest: () => void;
}

export const AuthHub: React.FC<AuthHubProps> = ({ onAuthenticated, onExploreAsGuest }) => {
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOAuth = async (provider: 'google' | 'github') => {
    soundService.playClick();
    setLoading(true);
    setErrorMsg('');
    try {
      const user = await authService.loginWithOAuth(provider);
      if (user) {
        soundService.playStreakFanfare();
        onAuthenticated(user);
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Falha ao autenticar com provedor social.');
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Preencha todos os campos.');
      return;
    }
    soundService.playClick();
    setLoading(true);
    setErrorMsg('');
    try {
      const user = mode === 'signup'
        ? await authService.signUpWithEmail(email, password)
        : await authService.loginWithEmail(email, password);
      soundService.playStreakFanfare();
      onAuthenticated(user);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Erro ao processar autenticação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-[#F7F7F7] dark:from-slate-900 dark:to-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 border-2 border-duo-border dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-duo-3d">
        {/* Mascot Greeting */}
        <div className="flex flex-col items-center text-center mb-6">
          <PythoMascot emotion="happy" size="md" />
          <h1 className="text-2xl font-black text-duo-charcoal dark:text-white mt-2">
            Bem-vindo ao Kodigo!
          </h1>
          <p className="text-xs text-duo-gray dark:text-slate-400 mt-1">
            Aprenda programação de forma divertida, prática e gratuita com o Pytho.
          </p>
        </div>

        {/* Toggle Mode */}
        <div className="flex p-1 bg-gray-100 dark:bg-slate-700 rounded-2xl mb-6">
          <button
            onClick={() => { setMode('signup'); setErrorMsg(''); }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
              mode === 'signup'
                ? 'bg-white dark:bg-slate-800 text-duo-green shadow-duo-gray'
                : 'text-duo-gray dark:text-slate-400'
            }`}
          >
            CRIAR CONTA
          </button>
          <button
            onClick={() => { setMode('login'); setErrorMsg(''); }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
              mode === 'login'
                ? 'bg-white dark:bg-slate-800 text-duo-blue shadow-duo-gray'
                : 'text-duo-gray dark:text-slate-400'
            }`}
          >
            ENTRAR
          </button>
        </div>

        {/* Social Logins 3D Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => handleOAuth('google')}
            disabled={loading}
            className="w-full py-3 px-4 rounded-2xl border-2 border-duo-border dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-gray-50 flex items-center justify-center gap-3 font-black text-xs uppercase tracking-wider text-duo-charcoal dark:text-white shadow-duo-gray active:translate-y-1 transition-all"
          >
            <Chrome className="w-5 h-5 text-red-500" />
            <span>Continuar com Google</span>
          </button>

          <button
            onClick={() => handleOAuth('github')}
            disabled={loading}
            className="w-full py-3 px-4 rounded-2xl border-2 border-slate-900 bg-slate-900 hover:bg-slate-800 flex items-center justify-center gap-3 font-black text-xs uppercase tracking-wider text-white shadow-duo-dark active:translate-y-1 transition-all"
          >
            <Github className="w-5 h-5" />
            <span>Continuar com GitHub</span>
          </button>
        </div>

        <div className="relative my-5 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-duo-border dark:border-slate-700" />
          </div>
          <span className="relative px-3 bg-white dark:bg-slate-800 text-[11px] font-black uppercase text-duo-gray">
            ou com e-mail
          </span>
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailAuth} className="space-y-3">
          <div className="relative">
            <Mail className="w-4 h-4 text-duo-gray absolute left-3.5 top-3.5" />
            <input
              type="email"
              placeholder="Seu endereço de e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-duo-border dark:border-slate-700 bg-duo-bg-light dark:bg-slate-900 font-bold text-xs text-duo-charcoal dark:text-white focus:outline-none focus:border-duo-green"
            />
          </div>

          <div className="relative">
            <Lock className="w-4 h-4 text-duo-gray absolute left-3.5 top-3.5" />
            <input
              type="password"
              placeholder="Sua senha secreta"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-duo-border dark:border-slate-700 bg-duo-bg-light dark:bg-slate-900 font-bold text-xs text-duo-charcoal dark:text-white focus:outline-none focus:border-duo-green"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs font-bold text-duo-red text-center">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-duo-green hover:bg-duo-green-dark text-white font-black text-xs uppercase tracking-wider shadow-duo-green active:translate-y-1 transition-all flex items-center justify-center gap-2"
          >
            <span>{mode === 'signup' ? 'Cadastrar e Começar' : 'Acessar Conta'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Guest Explore Mode */}
        <div className="mt-5 text-center">
          <button
            onClick={onExploreAsGuest}
            className="text-xs font-black text-duo-blue hover:underline inline-flex items-center gap-1"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Experimentar sem conta (Modo Visitante)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
