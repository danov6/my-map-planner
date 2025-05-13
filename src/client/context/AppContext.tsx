import React, { createContext } from 'react';
import { BlogPost } from '../../shared/types';

interface AppContextType {
  selectedCountry: string | null;
  blogs: BlogPost[];
  setSelectedCountry: (country: string | null) => void;
}

export const AppContext = createContext<AppContextType>({
  selectedCountry: null,
  blogs: [],
  setSelectedCountry: () => {},
});