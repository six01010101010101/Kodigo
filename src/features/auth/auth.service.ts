import { AuthUser } from './auth.types';

const AUTH_STORAGE_KEY = 'kodigo_auth_session';

class AuthService {
  getCurrentUser(): AuthUser | null {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }

  loginWithOAuth(provider: 'google' | 'github'): Promise<AuthUser> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const isGoogle = provider === 'google';
        const user: AuthUser = {
          id: `usr_${Date.now()}`,
          name: isGoogle ? 'Ken Kobayashi' : 'six01010101010101',
          email: 'kenkobayashi2005@gmail.com',
          avatarUrl: isGoogle
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
            : 'https://avatars.githubusercontent.com/u/10000000?v=4',
          provider,
          twoFactorEnabled: false,
          createdAt: new Date().toISOString()
        };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        resolve(user);
      }, 500);
    });
  }

  loginWithEmail(email: string, _password: string): Promise<AuthUser> {
    return new Promise((resolve, reject) => {
      if (!email.includes('@')) {
        reject(new Error('E-mail inválido. Insira um endereço de e-mail válido.'));
        return;
      }
      setTimeout(() => {
        const user: AuthUser = {
          id: `usr_${Date.now()}`,
          name: email.split('@')[0],
          email,
          provider: 'email',
          twoFactorEnabled: false,
          createdAt: new Date().toISOString()
        };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        resolve(user);
      }, 500);
    });
  }

  updateTwoFactor(enabled: boolean): AuthUser | null {
    const user = this.getCurrentUser();
    if (!user) return null;
    user.twoFactorEnabled = enabled;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    return user;
  }

  logout(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

export const authService = new AuthService();
