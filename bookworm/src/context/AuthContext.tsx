import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { USERS } from '../data/users';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<'ok' | 'email_taken'>;
  logout: () => void;
  updateWishlist: (bookId: string) => void;
  followAuthor: (authorId: string) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('bw_users');
    return saved ? JSON.parse(saved) : USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('bw_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('bw_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('bw_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('bw_user');
    }
  }, [currentUser]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const saved = localStorage.getItem('bw_users');
    const allUsers: User[] = saved ? JSON.parse(saved) : USERS;
    const user = allUsers.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser({ ...user });
      return true;
    }
    return false;
  }, []);

  const register = useCallback(async (
    name: string,
    email: string,
    password: string,
  ): Promise<'ok' | 'email_taken'> => {
    const saved = localStorage.getItem('bw_users');
    const allUsers: User[] = saved ? JSON.parse(saved) : USERS;
    if (allUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return 'email_taken';
    }
    const newUser: User = {
      id: `u${Date.now()}`,
      name,
      email,
      password,
      wishlist: [],
      followedAuthors: [],
    };
    const updated = [...allUsers, newUser];
    setUsers(updated);
    setCurrentUser({ ...newUser });
    return 'ok';
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const updateWishlist = useCallback((bookId: string) => {
    setCurrentUser(prev => {
      if (!prev) return null;
      const inList = prev.wishlist.includes(bookId);
      return {
        ...prev,
        wishlist: inList
          ? prev.wishlist.filter(id => id !== bookId)
          : [...prev.wishlist, bookId],
      };
    });
  }, []);

  const followAuthor = useCallback((authorId: string) => {
    setCurrentUser(prev => {
      if (!prev) return null;
      const following = prev.followedAuthors.includes(authorId);
      return {
        ...prev,
        followedAuthors: following
          ? prev.followedAuthors.filter(id => id !== authorId)
          : [...prev.followedAuthors, authorId],
      };
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        register,
        logout,
        updateWishlist,
        followAuthor,
        isAuthenticated: currentUser !== null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
