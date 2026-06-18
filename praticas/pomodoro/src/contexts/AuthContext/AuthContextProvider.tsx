import { useState, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import type { ApiUser } from '../../services/apiService';
import { loginUser, setToken, clearToken } from '../../services/apiService';

type AuthContextProviderProps = {
  children: ReactNode;
};

function loadUser(): ApiUser | null {
  try {
    const raw = sessionStorage.getItem('user');
    return raw ? (JSON.parse(raw) as ApiUser) : null;
  } catch {
    return null;
  }
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<ApiUser | null>(loadUser);
  const isAuthenticated = user !== null && sessionStorage.getItem('token') !== null;

  async function login(email: string, password: string): Promise<void> {
    const data = await loginUser({ email, password });
    setToken(data.token);
    sessionStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  }

  function logout() {
    clearToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
