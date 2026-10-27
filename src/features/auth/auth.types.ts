export type AuthProvider = 'google' | 'github' | 'email';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  provider: AuthProvider;
  twoFactorEnabled: boolean;
  createdAt: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
