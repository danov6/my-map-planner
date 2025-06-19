export interface CountryData {
  code: string;
  name: string;
  continent: string;
}

export interface UserProfile {
  _id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  profilePicture?: string;
  categories?: string[];
  countries?: string[];
  createdArticles?: string[];
  likedArticles?: string[];
  savedArticles?: Article[];
  favoriteTopics?: string[];
}

export interface ArticleStats {
    likes: number;
    views: number;
    saves: number;
}

export interface Article {
  _id: string;
  title: string;
  subtitle: string;
  author: UserProfile;
  date: Date;
  headerImageUrl: string;
  stats: ArticleStats;
  topics: string[];
  content: string;
  countryCode?: string;
}

export interface Country {
  _id: string;
  countryCode: string;
  countryName: string;
  continent: string;
  cities: City[];
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

export interface City {
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  countryCode: string;
}