import React, { createContext } from 'react';
import { BlogPost } from '../../shared/types';

interface AppContextType {
  selectedCountry: string | null;
  blogs: BlogPost[];
  setSelectedCountry: (country: string | null) => void;
}

export const AppContext = createContext<{
  selectedCountry: { name: string, countryCode: string } | null;
  setSelectedCountry: (country: { name: string; countryCode: string }) => void;
  blogs: {
    id: string;
    imageUrl?: string;
    title: string;
    publishDate: string;
    content: string;
  }[];
}>({
  selectedCountry: null,
  setSelectedCountry: () => {},
  blogs: []
});