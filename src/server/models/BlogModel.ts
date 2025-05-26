import mongoose, { Document, Schema } from 'mongoose';
import { BlogPost } from '../../shared/types';

// Create interface for the document
interface BlogDocument extends Omit<BlogPost, '_id'>, Document {
  id: string; // Explicitly redefine the 'id' property to resolve conflict
  createdAt: Date;
  updatedAt: Date;
  author: string; // Add the missing 'author' field
  imageUrl?: string; // Add the missing 'imageUrl' field
}

const blogSchema = new Schema<BlogDocument>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  countryCode: {
    type: String,
    required: [true, 'Country code is required'],
    trim: true,
    uppercase: true,
    minlength: [2, 'Country code must be 2 characters'],
    maxlength: [2, 'Country code must be 2 characters']
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true
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
  }
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Add indexes for better query performance
blogSchema.index({ countryCode: 1 });
blogSchema.index({ createdAt: -1 });

const BlogModel = mongoose.model<BlogDocument>('Blog', blogSchema);

export default BlogModel;