export interface GuideRequest {
    countryCode: string;
    countryName: string;
    selectedOptions: string[];
  }
  
export interface GuideResponse {
    header: string;
    content: string;
}