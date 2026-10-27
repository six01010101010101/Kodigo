import React, { useState } from 'react';
import { Mail, Shield, KeyRound, Eye, Sliders, LogOut, CheckCircle, Smartphone } from 'lucide-react';
import { AuthUser } from '../../auth/auth.types';
import { authService } from '../../auth/auth.service';
import { ThemeSelector } from '../../theme/components/ThemeSelector.component';
import { AppTheme } from '../../theme/theme.types';
import { soundService } from '../../../services/sound.service';

interface ProfileViewProps {
  user: AuthUser | null;
  currentTheme: AppTheme;
  onChangeTheme: (theme: AppTheme) => void;
  onLogout: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  currentTheme,
  onChangeTheme,
  onLogout
}) => {
  const [twoFactor, setTwoFactor] = useState(user?.twoFactorEnabled ?? false);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<string | null>(null);

  const handleToggle2FA = () => {
    soundService.playClick();
    const updated = !twoFactor;
    setTwoFactor(updated);
    authService.updateTwoFactor(updated);
  };

  const handlePasswordChange = () => {
    soundService.playClick();
    setPasswordStatus('Instruções de redefinição de senha enviadas para o seu e-mail!');
    setTimeout(() => setPasswordStatus(null), 4000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* User Info Header */}
      <div className="bg-white dark:bg-slate-800 border-2 border-duo-border dark:border-slate-700 rounded-3xl p-6 shadow-sm flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-duo-green text-white flex items-center justify-center font-black text-2xl shadow-duo-green flex-shrink-0">
          {user?.name ? user.name[0].toUpperCase() : 'K'}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-black text-duo-charcoal dark:text-white truncate">
            {user?.name || 'Desenvolvedor Kodigo'}
          </h2>
          <p className="text-xs text-duo-gray dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
            <Mail className="w-3.5 h-3.5" />
            <span className="truncate">{user?.email || 'visitante@kodigo.dev'}</span>
          </p>
        </div>
      </div>

      {/* Aparência & Tema */}
      <div className="bg-white dark:bg-slate-800 border-2 border-duo-border dark:border-slate-700 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-duo-charcoal dark:text-white font-black text-sm">
          <Eye className="w-4 h-4 text-duo-blue" />
          <h3>Aparência do Kodigo</h3>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-duo-gray dark:text-slate-400">
            Esquema de cores da interface
          </span>
          <ThemeSelector currentTheme={currentTheme} onChangeTheme={onChangeTheme} />
        </div>
      </div>

      {/* Segurança & 2FA */}
      <div className="bg-white dark:bg-slate-800 border-2 border-duo-border dark:border-slate-700 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-duo-charcoal dark:text-white font-black text-sm">
          <Shield className="w-4 h-4 text-duo-green" />
          <h3>Segurança da Conta</h3>
        </div>

        {/* 2FA Toggle */}
        <div className="flex items-center justify-between py-2 border-b border-duo-border dark:border-slate-700">
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-4 h-4 text-duo-purple" />
            <div>
              <p className="text-xs font-black text-duo-charcoal dark:text-white">
                Autenticação de Dois Fatores (2FA)
              </p>
              <p className="text-[11px] text-duo-gray dark:text-slate-400">
                Adicione uma camada extra via App Autenticador
              </p>
            </div>
          </div>
          <button
            onClick={handleToggle2FA}
            className={`w-12 h-7 rounded-full p-1 transition-colors ${
              twoFactor ? 'bg-duo-green' : 'bg-gray-300 dark:bg-slate-600'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                twoFactor ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Change Password */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2.5">
            <KeyRound className="w-4 h-4 text-duo-yellow-dark" />
            <div>
              <p className="text-xs font-black text-duo-charcoal dark:text-white">Senha</p>
              <p className="text-[11px] text-duo-gray dark:text-slate-400">
                Última alteração recente
              </p>
            </div>
          </div>
          <button
            onClick={handlePasswordChange}
            className="px-3 py-1.5 rounded-xl border border-duo-border dark:border-slate-600 text-xs font-black text-duo-charcoal dark:text-white hover:bg-duo-bg-light"
          >
            Redefinir
          </button>
        </div>
        {passwordStatus && (
          <p className="text-xs font-bold text-duo-green flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" />
            <span>{passwordStatus}</span>
          </p>
        )}
      </div>

      {/* Acessibilidade */}
      <div className="bg-white dark:bg-slate-800 border-2 border-duo-border dark:border-slate-700 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-duo-charcoal dark:text-white font-black text-sm">
          <Sliders className="w-4 h-4 text-duo-yellow-dark" />
          <h3>Acessibilidade & Preferências</h3>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-duo-border dark:border-slate-700">
          <span className="text-xs font-bold text-duo-charcoal dark:text-white">
            Alto Contraste nos Textos
          </span>
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`w-10 h-6 rounded-full p-0.5 transition-colors ${
              highContrast ? 'bg-duo-blue' : 'bg-gray-300 dark:bg-slate-600'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                highContrast ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-2">
          <span className="text-xs font-bold text-duo-charcoal dark:text-white">
            Redução de Animações
          </span>
          <button
            onClick={() => setReducedMotion(!reducedMotion)}
            className={`w-10 h-6 rounded-full p-0.5 transition-colors ${
              reducedMotion ? 'bg-duo-blue' : 'bg-gray-300 dark:bg-slate-600'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                reducedMotion ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Logout */}
      <div className="text-center pt-2">
        <button
          onClick={onLogout}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border-2 border-duo-red text-duo-red hover:bg-red-50 dark:hover:bg-red-950 font-black text-xs uppercase tracking-wider transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Encerrar Sessão</span>
        </button>
      </div>
    </div>
  );
};
