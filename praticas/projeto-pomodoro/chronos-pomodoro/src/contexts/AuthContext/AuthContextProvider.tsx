import { useState, type ReactNode } from 'react';
import { AuthContext, MOCK_CREDENTIALS } from './AuthContext';

type AuthContextProviderProps = {
  children: ReactNode;
};

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('isAuthenticated') === 'true';
  });

  function login(username: string, password: string): boolean {
    const isValid =
      username === MOCK_CREDENTIALS.username &&
      password === MOCK_CREDENTIALS.password;

    if (isValid) {
      setIsAuthenticated(true);
      sessionStorage.setItem('isAuthenticated', 'true');
    }

    return isValid;
  }

  function logout() {
    setIsAuthenticated(false);
    sessionStorage.removeItem('isAuthenticated');
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
