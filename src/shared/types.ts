export interface BlogPost {
    id: string;
    title: string;
    content: string;
    countryCode: string;
    imageUrl?: string;
    publishDate: string;
  }
  
  export interface CountryData {
    code: string;
    name: string;
    continent: string;
  }