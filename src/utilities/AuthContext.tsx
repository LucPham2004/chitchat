import { createContext, useContext, useState, ReactNode } from 'react';
import { Account } from '../types/backend';
import { UserResponse } from '../types/User';

interface AuthContextType {
  user: Account | null;
  userAccount: UserResponse | null;
  login: (account: Account) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Account | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [userAccount, setUserAccount] = useState<UserResponse | null>(() => {
    const storedUser = localStorage.getItem('user_account');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (account: Account) => {
    setUser(account);
    localStorage.setItem('user', JSON.stringify(account));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, userAccount, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
