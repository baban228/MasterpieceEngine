// src/context/UserContext.tsx
import React, { createContext, useContext, useState } from 'react';

export interface User {
  id: number;
  name: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  login: (user: Omit<User, 'id'>) => void; // Функция принимает объект без id
  logout: () => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  login: () => {},
  logout: () => {}
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userIdCounter, setUserIdCounter] = useState<number>(1); // Счётчик для генерации id

  const login = (user: Omit<User, 'id'>) => {
    const newUser: User = { ...user, id: userIdCounter }; // Генерация id
    setUser(newUser);
    setUserIdCounter(prevId => prevId + 1); // Увеличение счётчика
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};