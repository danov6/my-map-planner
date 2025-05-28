import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mongoose from 'mongoose';

// Route imports
import authRoutes from './routes/authRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import guideRoutes from './routes/guideRoutes.js';

// Configure environment variables
dotenv.config();

// Type definitions
interface ErrorWithStack extends Error {
  stack?: string;
}

// Constants
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = process.env.PORT || 53195;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:1234';

// CORS Configuration
const corsOptions = {
  origin: CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 86400
};

// Global Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Cache Control Middleware
app.use((req, res, next) => {
  res.set({
    'Cache-Control': 'no-store',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  next();
});

// Database Connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));


// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/guides', guideRoutes);

// Health Check Routes
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.get('/test-cors', (req: Request, res: Response) => {
  res.json({ message: 'CORS is working' });
});

// Error Handling Middleware
app.use((err: ErrorWithStack, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Server Initialization
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;