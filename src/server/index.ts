import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
//import mongoose from 'mongoose';
import blogRoutes from './routes/blogRoutes.js';
import guideRoutes from './routes/guideRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 53195;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase';
const CLIENT_URL = 'http://localhost:1234';
//const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:1234';

// Configure dotenv
dotenv.config();

interface ErrorWithStack extends Error {
  stack?: string;
}

// Middleware
app.use((err: ErrorWithStack, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// app.use(cors({
//   origin: CLIENT_URL,
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   exposedHeaders: ['Content-Range', 'X-Content-Range'],
//   credentials: true,
//   maxAge: 86400
// }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", CLIENT_URL);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());

// Disable caching middleware
app.use((req, res, next) => {
    res.set({
      'Cache-Control': 'no-store',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    next();
});

// mongoose.connect(MONGODB_URI)
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api/blogs', blogRoutes);
app.use('/api/guides', guideRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/test-cors', (req, res) => {
  res.json({ message: 'CORS is working' });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// // Serve static files and handle client-side routing
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../../public/index.html'));
// });

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;