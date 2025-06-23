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
  setSelectedCountry: (country: { name: string; countryCode: string}) => void;
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
  isFlightsSectionClosed: boolean;
  setIsFlightsSectionClosed: (isFlightsSectionClosed: boolean) => void;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);