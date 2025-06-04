import express, { Request, Response, Router } from 'express';
import { BlogPost } from '../../shared/types';
import BlogModel from '../models/BlogModel';

const router: Router = express.Router();

// Mock data for testing
const mockBlogs: Record<string, BlogPost[]> = {
  'USA': [
    {
      id: '1',
      title: 'My Trip to New York',
      content: 'Exploring the Big Apple was amazing...',
      countryCode: 'USA',
      author: 'John Doe',
      imageUrl: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee',
      createdAt: new Date('2024-01-15'),
      publishDate: '2024-01-20'
    },
    {
      id: '2',
      title: 'California Dreams',
      content: 'The west coast has the best beaches...',
      countryCode: 'US',
      author: 'Jane Smith',
      imageUrl: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29',
      createdAt: new Date('2024-02-20'),
      publishDate: '2024-02-25'
    }
  ],
  'FRA': [
    {
      id: '3',
      title: 'Paris in Spring',
      content: 'The Eiffel Tower is even more beautiful...',
      countryCode: 'FRA',
      author: 'Alice Wilson',
      imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
      createdAt: new Date('2024-03-10'),
      publishDate: '2024-03-15'
    }
  ],
  // Add more countries as needed
};

// Update the country route to return mock data
router.get('/country/:countryCode', async (req: Request, res: Response) => {
  try {
    const { countryCode } = req.params;
    res.setHeader('Content-Type', 'application/json');
    
    // Return mock data for the country or empty array if none exists
    const blogs = mockBlogs[countryCode.toUpperCase()] || [];
    res.json(blogs);
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// GET all blog posts
router.get('/', async (req: Request, res: Response) => {
  try {
    const blogs: BlogPost[] = await BlogModel.find();
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// GET blog posts by country code
router.get('/country/:countryCode', async (req: Request, res: Response) => {
  try {
    const blogs: BlogPost[] = await BlogModel.find({ countryCode: req.params.countryCode });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blog posts for country' });
  }
});

// GET single blog post
// router.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
//   try {
//     const blog: BlogPost | null = await BlogModel.findById(req.params.id);
//     if (!blog) {
//       return res.status(404).json({ error: 'Blog post not found' });
//     }
//     res.json(blog);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch blog post' });
//   }
// });

// POST new blog post
// router.post('/', async (req: Request, res: Response) => {
//   try {
//     const newBlog = new BlogModel(req.body);
//     const savedDoc = await newBlog.save();
//     const savedBlog: BlogPost = {
//       id: savedDoc._id.toString(),
//       title: savedDoc.title,
//       content: savedDoc.content,
//       author: savedDoc.author,
//       imageUrl: savedDoc.imageUrl,
//       countryCode: savedDoc.countryCode,
//       createdAt: savedDoc.createdAt,
//       publishDate: savedDoc.publishDate,
//     };
//     res.status(201).json(savedBlog);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to create blog post' });
//   }
// });

// PUT update blog post
// router.put('/:id', async (req: Request, res: Response) => {
//   try {
//     const updatedBlog: BlogPost | null = await BlogModel.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     if (!updatedBlog) {
//       return res.status(404).json({ error: 'Blog post not found' });
//     }
//     res.json(updatedBlog);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to update blog post' });
//   }
// });

export default router;