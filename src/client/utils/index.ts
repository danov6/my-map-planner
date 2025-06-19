import { countries } from 'countries-list';

interface CountryBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

// Predefined bounds for most common countries
const countryBoundsData: Record<string, CountryBounds> = {
  US: {
    north: 49.388611,
    south: 24.544245,
    east: -66.954811,
    west: -124.733253
  },
  GB: {
    north: 58.6350,
    south: 49.9594,
    east: 1.7628,
    west: -8.1497
  },
};

export const getCountryBounds = (countryCode: string | null): CountryBounds | null => {
  try {
    const code = countryCode?.toUpperCase();
    
    if (!code || !Object.prototype.hasOwnProperty.call(countries, code)) {
      console.error(`Invalid country code: ${code}`);
      return null;
    }

    if (countryBoundsData[code]) {
      return countryBoundsData[code];
    }

    console.warn(`No precise bounds found for ${code}, using fallback`);
    return {
      north: 60,
      south: -60,
      east: 180,
      west: -180
    };
  } catch (error) {
    console.log('Error getting country bounds:', error);
    return null;
  }
};

export const isValidCountryCode = (code: string): boolean => {
  return Object.prototype.hasOwnProperty.call(countries, code.toUpperCase());
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};