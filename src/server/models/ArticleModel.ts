import mongoose, { Schema } from 'mongoose';
import { Article } from '../../shared/types';
import { IUser } from './UserModel';

const articleSchema = new Schema<Article>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  subtitle: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  date: {
    type: Date,
    default: Date.now
  },
  imageUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Invalid image URL format'
    }
  },
  countryCode: {
    type: String,
    index: true
  },
  categories: [{
    type: String,
    index: true
  }],
  topics: [String],
  stats: {
    likes: {
      type: Number,
      default: 0,
      min: [0, 'Likes cannot be negative']
    },
    views: {
      type: Number,
      default: 0,
      min: [0, 'Views cannot be negative']
    },
    saves: {
      type: Number,
      default: 0,
      min: [0, 'Saves cannot be negative']
    }
  },
});

// Add indexes for better query performance
articleSchema.index({ countryCode: 1 });
articleSchema.index({ createdAt: -1 });
articleSchema.index({ votes: -1 }); // Add index for votes

const BlogModel = mongoose.model<Article>('Article', articleSchema);

export default BlogModel;