# Map Blog Explorer

An interactive web application that displays blogs related to countries on a clickable world map. Built with TypeScript, React, Node.js, and MongoDB.

## Features

- Interactive world map using Leaflet
- Country-specific blog posts
- Search and filter functionality
- Responsive design for all devices
- MongoDB integration for data storage

## Tech Stack

- **Frontend**: React, TypeScript, Leaflet
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Build Tool**: Parcel
- **Styling**: CSS/SCSS

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Yarn package manager
- MongoDB (local or Atlas connection)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/map-blog-explorer.git
   cd map-blog-explorer
   ```

2. Install dependencies
   ```bash
   yarn install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3001
   MONGO_URI=mongodb://localhost:27017/map-blog-app
   NODE_ENV=development
   ```

4. Seed the database with initial data
   ```bash
   yarn seed
   ```

5. Start the development server
   ```bash
   yarn dev
   ```

6. Open your browser and navigate to `http://localhost:1234`

## Project Structure

```
map-blog-app/
├── src/
│   ├── client/           # Frontend code
│   │   ├── components/   # React components
│   │   ├── context/      # App context
│   │   ├── App.tsx       # Main App component
│   │   └── index.tsx     # Entry point
│   ├── server/           # Backend code
│   │   ├── models/       # MongoDB models
│   │   ├── routes/       # API routes
│   │   └── index.ts      # Express server
│   └── shared/           # Shared types
├── public/               # Static assets
│   └── assets/           # Images, GeoJSON data
├── tsconfig.json         # TypeScript configuration
└── package.json          # Project dependencies
```

## Scripts

- `yarn dev` - Start development server (frontend + backend)
- `yarn start` - Start frontend development server
- `yarn server` - Start backend server
- `yarn build` - Build for production
- `yarn seed` - Seed database with initial data

## GeoJSON Data

The application uses GeoJSON data for country boundaries. You can download a simplified version from [Natural Earth Data](https://www.naturalearthdata.com/).

## API Endpoints

- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/country/:countryCode` - Get blogs for a specific country
- `GET /api/blogs/:id` - Get a specific blog by ID
- `GET /api/countries` - Get all countries
- `GET /api/countries/with-blogs` - Get countries that have associated blogs

## Deployment

### Production Build

```bash
yarn build
```

### Docker Deployment (Optional)

```bash
docker-compose up -d
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Leaflet](https://leafletjs.com/) for the interactive map
- [Natural Earth](https://www.naturalearthdata.com/) for GeoJSON data
- [Parcel](https://parceljs.org/) for zero-configuration bundling
