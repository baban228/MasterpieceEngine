// src/context/UserContext.tsx
import React, { createContext, useContext, useState } from 'react';

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string; // Добавляем поле для аватара
}

interface UserContextType {
  user: User | null;
  login: (userData: Partial<User>) => void; // Обновляем тип login для частичного обновления пользователя
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

  const login = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    } else {
      const newUser: User = { id: userIdCounter, ...userData } as User; // Генерация id
      setUser(newUser);
      setUserIdCounter(prevId => prevId + 1); // Увеличение счётчика
    }
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