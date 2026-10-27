import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { AppTheme } from '../theme.types';
import { soundService } from '../../../services/sound.service';

interface ThemeSelectorProps {
  currentTheme: AppTheme;
  onChangeTheme: (theme: AppTheme) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onChangeTheme
}) => {
  const options: { id: AppTheme; label: string; icon: React.ReactNode }[] = [
    { id: 'light', label: 'Claro', icon: <Sun className="w-4 h-4 text-amber-500" /> },
    { id: 'dark', label: 'Escuro', icon: <Moon className="w-4 h-4 text-indigo-400" /> },
    { id: 'system', label: 'Sistema', icon: <Laptop className="w-4 h-4 text-duo-gray" /> }
  ];

  const handleSelect = (t: AppTheme) => {
    soundService.playClick();
    onChangeTheme(t);
  };

  return (
    <div className="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-slate-800 rounded-2xl border-2 border-duo-border dark:border-slate-700">
      {options.map((opt) => {
        const isActive = currentTheme === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => handleSelect(opt.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all duration-150 ${
              isActive
                ? 'bg-white dark:bg-slate-700 text-duo-charcoal dark:text-white shadow-duo-gray'
                : 'text-duo-gray dark:text-slate-400 hover:text-duo-charcoal'
            }`}
          >
            {opt.icon}
            <span className="hidden sm:inline">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};
