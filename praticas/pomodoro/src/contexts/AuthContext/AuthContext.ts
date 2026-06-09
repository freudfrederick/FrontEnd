import { createContext } from 'react';
import type { ApiUser } from '../../services/apiService';

export type AuthContextType = {
  isAuthenticated: boolean;
  user: ApiUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: () => {},
});
