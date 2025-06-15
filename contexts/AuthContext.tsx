// AuthContext is now deprecated. Use useAuthStore from store/authStore instead.
export const useAuth = () => { throw new Error('AuthContext is removed. Use useAuthStore from store/authStore.'); };
export const AuthProvider = ({ children }: { children: any }) => children;
