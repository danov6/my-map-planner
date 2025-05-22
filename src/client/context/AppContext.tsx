import React, { createContext } from 'react';
import { BlogPost } from '../../shared/types';

export interface TravelOption {
  id: string;
  text: string;
}

export const AppContext = createContext<{
  selectedCountry: { name: string, countryCode: string } | null;
  setSelectedCountry: (country: { name: string; countryCode: string }) => void;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  blogs: {
    id: string;
    imageUrl?: string;
    title: string;
    publishDate: string;
    content: string;
  }[];
  selectedOptions: TravelOption[];
  setSelectedOptions: (options: TravelOption[]) => void;
}>({
  selectedCountry: null,
  setSelectedCountry: () => {},
  isModalOpen: false,
  setIsModalOpen: () => {},
  blogs: [],
  selectedOptions: [],
  setSelectedOptions: () => {},
});