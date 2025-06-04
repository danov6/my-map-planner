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

export interface Guide {
  header: string;
  content: string;
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
}