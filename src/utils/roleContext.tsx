import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Role, User } from '@/data/mockData';

interface RoleContextType {
  currentRole: Role | null;
  currentUser: User | null;
  setRole: (role: Role, user: User) => void;
  logout: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const setRole = (role: Role, user: User) => {
    setCurrentRole(role);
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentRole(null);
    setCurrentUser(null);
  };

  return (
    <RoleContext.Provider value={{ currentRole, currentUser, setRole, logout }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
