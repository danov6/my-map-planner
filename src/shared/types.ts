export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  imageUrl?: string;
  countryCode: string;
  createdAt: Date;
  publishDate: string;
}

export interface CountryData {
  code: string;
  name: string;
  continent: string;
}

export interface UserProfile {
  email: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  profilePicture?: string;
  blogs?: string[];
  favorites?: BlogPost[];
  categories?: string[];
  countries?: string[];
}

export interface ArticleStats {
    likes: number;
    views: number;
    saves: number;
}

export interface Article {
  id: string;
  title: string;
  subtitle: string;
  author: UserProfile;
  date: Date;
  imageUrl: string;
  stats: ArticleStats;
  topics: string[];
  content: string;
  countryCode?: string;
  categories?: string[];
}