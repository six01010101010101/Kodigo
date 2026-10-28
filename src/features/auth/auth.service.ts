import { supabase } from '../../services/supabase.client';
import { AuthUser, AuthProvider } from './auth.types';

const AUTH_STORAGE_KEY = 'kodigo_auth_session';

class AuthService {
  private cachedUser: AuthUser | null = null;

  constructor() {
    this.loadFromCache();
    this.listenToAuthChanges();
  }

  private loadFromCache(): void {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      try {
        this.cachedUser = JSON.parse(raw) as AuthUser;
      } catch {
        this.cachedUser = null;
      }
    }
  }

  private listenToAuthChanges(): void {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = session.user;
        const provider = (u.app_metadata.provider || 'email') as AuthProvider;
        const authUser: AuthUser = {
          id: u.id,
          email: u.email || 'usuario@kodigo.dev',
          name: (u.user_metadata?.name || u.user_metadata?.full_name || u.email?.split('@')[0] || 'Desenvolvedor') as string,
          avatarUrl: (u.user_metadata?.avatar_url || u.user_metadata?.picture) as string | undefined,
          provider: provider === 'google' || provider === 'github' ? provider : 'email',
          twoFactorEnabled: false,
          createdAt: u.created_at
        };
        this.cachedUser = authUser;
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
      } else if (!session) {
        // Only clear if explicitly signed out from Supabase
        const raw = localStorage.getItem(AUTH_STORAGE_KEY);
        if (raw) {
          try {
            const parsed = JSON.parse(raw) as AuthUser;
            if (parsed.provider === 'google' || parsed.provider === 'github') {
              this.cachedUser = null;
              localStorage.removeItem(AUTH_STORAGE_KEY);
            }
          } catch {
            this.cachedUser = null;
          }
        }
      }
    });
  }

  getCurrentUser(): AuthUser | null {
    if (this.cachedUser) return this.cachedUser;
    this.loadFromCache();
    return this.cachedUser;
  }

  async loginWithEmail(email: string, password: string): Promise<AuthUser> {
    if (!email || !email.includes('@')) {
      throw new Error('E-mail inválido. Insira um endereço de e-mail válido.');
    }
    if (!password || password.length < 6) {
      throw new Error('A senha deve ter pelo menos 6 caracteres.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw new Error(error.message);
    }

    const u = data.user;
    const authUser: AuthUser = {
      id: u.id,
      email: u.email || email,
      name: (u.user_metadata?.name || email.split('@')[0]) as string,
      provider: 'email',
      twoFactorEnabled: false,
      createdAt: u.created_at
    };
    this.cachedUser = authUser;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
    return authUser;
  }

  async signUpWithEmail(email: string, password: string): Promise<AuthUser> {
    if (!email || !email.includes('@')) {
      throw new Error('E-mail inválido. Insira um endereço de e-mail válido.');
    }
    if (!password || password.length < 6) {
      throw new Error('A senha deve ter pelo menos 6 caracteres.');
    }

    const name = email.split('@')[0];
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });
    if (error) {
      throw new Error(error.message);
    }

    const u = data.user;
    const authUser: AuthUser = {
      id: u?.id || `usr_${Date.now()}`,
      email: u?.email || email,
      name,
      provider: 'email',
      twoFactorEnabled: false,
      createdAt: u?.created_at || new Date().toISOString()
    };
    this.cachedUser = authUser;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
    return authUser;
  }

  async loginWithOAuth(provider: 'google' | 'github'): Promise<void> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) {
      throw new Error(error.message);
    }
  }

  updateTwoFactor(enabled: boolean): AuthUser | null {
    const user = this.getCurrentUser();
    if (!user) return null;
    user.twoFactorEnabled = enabled;
    this.cachedUser = user;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    return user;
  }

  async logout(): Promise<void> {
    this.cachedUser = null;
    localStorage.removeItem(AUTH_STORAGE_KEY);
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignored
    }
  }
}

export const authService = new AuthService();
