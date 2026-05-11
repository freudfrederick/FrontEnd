import { createContext } from 'react';

export const MOCK_CREDENTIALS = {
  username: 'freud@iesb',
  password: 'iesb',
};

export type AuthContextType = {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
});
