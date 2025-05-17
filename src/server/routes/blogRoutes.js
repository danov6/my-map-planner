import express from 'express';
import { BlogPost } from '../../shared/types';
import BlogModel from '../models/BlogModel';

const router = express.Router();

// GET all blog posts
router.get('/', async (req, res) => {
  try {
    const blogs = await BlogModel.find();
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// GET blog posts by country code
router.get('/country/:countryCode', async (req, res) => {
  try {
    const blogs = await BlogModel.find({ countryCode: req.params.countryCode });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blog posts for country' });
  }
});

// GET single blog post
router.get('/:id', async (req, res) => {
  try {
    const blog = await BlogModel.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

// POST new blog post
router.post('/', async (req, res) => {
  try {
    const newBlog = new BlogModel(req.body);
    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create blog post' });
  }
});

// PUT update blog post
router.put('/:id', async (req, res) => {
  try {
    const updatedBlog = await BlogModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedBlog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.json(updatedBlog);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update blog post' });
  }
});

// DELETE blog post
router.delete('/:id', async (req, res) => {
  try {
    const deletedBlog = await BlogModel.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.json({ message: 'Blog post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
});

export default router;