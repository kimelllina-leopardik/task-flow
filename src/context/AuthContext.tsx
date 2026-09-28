import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  register: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial in-memory user registry for clean demonstration
interface UserRecord extends User {
  passwordHash: string;
}

const INITIAL_USERS: UserRecord[] = [
  {
    id: 'user-alex-101',
    email: 'alex@example.com',
    passwordHash: 'password123',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'user-sarah-102',
    email: 'sarah@example.com',
    passwordHash: 'password123',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  // In-memory state only - no localStorage, ready for Supabase client
  const [users, setUsers] = useState<UserRecord[]>(INITIAL_USERS);
  // Default to alex logged in or start at login screen?
  // Let's start with user: null or alex? Starting with alex or login?
  // Let's start with null so the login/registration page is shown first, or easily one-click demo.
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const register = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 250)); // smooth micro-interaction

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setIsLoading(false);
      return { success: false, error: 'Please enter a valid email address.' };
    }

    if (password.length < 6) {
      setIsLoading(false);
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const existing = users.find((u) => u.email === normalizedEmail);
    if (existing) {
      setIsLoading(false);
      return { success: false, error: 'An account with this email already exists. Please log in.' };
    }

    const newUser: UserRecord = {
      id: `user-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      email: normalizedEmail,
      passwordHash: password,
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);
    setUser({ id: newUser.id, email: newUser.email, createdAt: newUser.createdAt });
    setIsLoading(false);
    return { success: true };
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 250)); // smooth micro-interaction

    const normalizedEmail = email.trim().toLowerCase();
    const foundUser = users.find((u) => u.email === normalizedEmail);

    if (!foundUser) {
      setIsLoading(false);
      return { success: false, error: 'No account found with this email. Create one to get started.' };
    }

    if (foundUser.passwordHash !== password) {
      setIsLoading(false);
      return { success: false, error: 'Incorrect password. Please verify and try again.' };
    }

    setUser({
      id: foundUser.id,
      email: foundUser.email,
      createdAt: foundUser.createdAt,
    });
    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
