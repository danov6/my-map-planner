import React, { createContext, useState } from 'react';
import { UserProfile } from '../../shared/types';
import { Article } from '../../shared/types';

export interface TravelOption {
  id: string;
  text: string;
}

export interface Guide {
  header: string;
  content: string;
}

interface AppContextType {
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
  articles: Article[] | null;
  setArticles: (articles: Article[]) => void;
  highlightedMapCountries: string[] | null;
  setHighlightedMapCountries: (countries: string[]) => void;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCountry, setSelectedCountry] = useState<{ name: string, countryCode: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<TravelOption[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [highlightedMapCountries, setHighlightedMapCountries] = useState<string[] | null>([]);

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AppContext.Provider value={{
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
      logout,
      articles,
      setArticles,
      highlightedMapCountries,
      setHighlightedMapCountries
    }}>
      {children}
    </AppContext.Provider>
  );
};