export interface BlogPost {
  _id?: string;
  title: string;
  content: string;
  countryCode: string;
  createdAt: Date;
}
  
export interface CountryData {
  code: string;
  name: string;
  continent: string;
}