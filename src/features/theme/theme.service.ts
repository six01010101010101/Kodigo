import { AppTheme } from './theme.types';

const THEME_STORAGE_KEY = 'kodigo_theme_preference';

class ThemeService {
  getTheme(): AppTheme {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as AppTheme | null;
    return saved || 'system';
  }

  setTheme(theme: AppTheme): void {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    this.applyTheme(theme);
  }

  applyTheme(theme: AppTheme): void {
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  init(): void {
    this.applyTheme(this.getTheme());
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (this.getTheme() === 'system') {
        this.applyTheme('system');
      }
    });
  }
}

export const themeService = new ThemeService();
