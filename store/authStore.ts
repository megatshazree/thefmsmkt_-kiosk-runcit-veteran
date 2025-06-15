import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  login: (user: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
  username: localStorage.getItem('username'),
  login: async (user: string, pass: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if ((user === 'admin@example.com' || user === 'test@example.com') && pass === 'password') {
          set({ isAuthenticated: true, username: user.split('@')[0].replace(/^./, c => c.toUpperCase()) });
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('username', user.split('@')[0].replace(/^./, c => c.toUpperCase()));
          resolve(true);
        } else {
          set({ isAuthenticated: false, username: null });
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('username');
          resolve(false);
        }
      }, 500);
    });
  },
  logout: () => {
    set({ isAuthenticated: false, username: null });
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
  },
}));
