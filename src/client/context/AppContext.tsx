import React, { createContext, useState, useEffect } from 'react';
import { UserProfile } from '../../shared/types';

export interface TravelOption {
  id: string;
  text: string;
}

export interface Guide {
  header: string;
  content: string;
}

interface AppContextType {
  guide: Guide[] | null;
  setGuide: (guide: Guide[] | null) => void;
  selectedCountry: { name: string, countryCode: string } | null;
  setSelectedCountry: (country: { name: string; countryCode: string }) => void;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  selectedOptions: TravelOption[];
  setSelectedOptions: (options: TravelOption[]) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  logout: () => void;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [guide, setGuide] = useState<Guide[] | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<{ name: string, countryCode: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [blogs, setBlogs] = useState<{
    id: string;
    imageUrl?: string;
    title: string;
    publishDate: string;
    content: string;
  }[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<TravelOption[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AppContext.Provider value={{
      guide,
      setGuide,
      selectedCountry,
      setSelectedCountry,
      isModalOpen,
      setIsModalOpen,
      selectedOptions,
      setSelectedOptions,
      isAuthenticated,
      setIsAuthenticated,
      user,
      setUser,
      logout
    }}>
      {children}
    </AppContext.Provider>
  );
};