import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    localStorage.setItem('auth0.is.authenticated', String(isAuthenticated));
    localStorage.setItem('auth0.is.loading', String(isLoading));
  }, [isAuthenticated, isLoading]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 