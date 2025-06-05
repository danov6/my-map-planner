export const recommendationOptions = [
  { id: 'tourist', text: 'Top Tourist Attractions' },
  { id: 'cities', text: 'Best cities to visit' },
  { id: 'michelin', text: 'Michelin Guide Restaurants' },
  { id: 'budget', text: 'Top 10 Budget Tips' },
{ id: 'adventure', text: 'Adventure Activities' },
{ id: 'food', text: 'Food/Beverage Ideas' },
{ id: 'culture', text: 'Cultural Experiences' },
{ id: 'nightlife', text: 'Nightlife and Entertainment' },
{ id: 'nature', text: 'Nature and Outdoor Activities' },
{ id: 'shopping', text: 'Shopping Destinations' }
];
// export const recommendationOptions = [
//   { id: 'tourist', text: 'Tourist Attractions' },
//   { id: 'food', text: 'Food/Beverage Ideas' },
//   { id: 'adventure', text: 'Adventure Activities' },
//   { id: 'budget', text: 'Budget Friendly Options' }
// ];

export const COUNTRY_BLACKLIST = [
  'ATA', // Antarctica
  'GRL', // Greenland
  'HMD', // Heard Island and McDonald Islands
  'WLF', // Wallis and Futuna
  'ESH', // Western Sahara
  'TKL', // Tokelau
  'UMI', // United States Minor Outlying Islands
  'VGB', // British Virgin Islands
  'VIR', // United States Virgin Islands
  'CXR', // Christmas Island
  'CCK', // Cocos (Keeling) Islands
  'NFK', // Norfolk Island
  'ATF', // French Southern and Antarctic Lands
];

export const COUNTRY_COLORS = {
  BLACKLIST: '#7a848d', // Lighter blue for blacklisted countries
  WHITELIST: '#4a90e2' // Default color for other countries
};

export const TRAVEL_TOPICS = [
  'Travel Hacks',
  'Cultural Experiences',
  'Adventure Travel',
  'Hotels and Accommodations',
  'Food and Cuisine',
  'Top 10 Lists',
  'Airbnb and Vacation Rentals',
  'Nightlife',
  'Nature and Outdoor Activities',
  'Shopping',
  'Budget Travel',
];