import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import BlogModel from '../models/BlogModel';

// Constants
const SALT_ROUNDS = 10;

// Interfaces
export interface IUser extends Document {
  username?: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  bio?: string;
  favorites?: string[];
  blogs?: string[];
  email: string;
  password: string;
  resetToken?: string | null;
  resetTokenExpiry?: Date | null;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Schema Definition
const userSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: 'Invalid email format'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  resetToken: {
    type: String,
    default: null
  },
  resetTokenExpiry: {
    type: Date,
    default: null
  },
  firstName: { type: String },
  lastName: { type: String },
  profilePicture: {
    type: String,
    default: null
  },
  bio: { type: String },
  favorites: [{ type: Schema.Types.ObjectId, ref: 'Blog' }],
  blogs: [{ type: Schema.Types.ObjectId, ref: 'Blog' }]
}, {
  timestamps: true,
  toJSON: {
    transform: (_doc, ret) => {
      delete ret.password;
      delete ret.__v;
      return ret;
    }
  }
});

// Middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Methods
userSchema.methods.comparePassword = async function(
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Model Creation
const User = mongoose.model<IUser>('User', userSchema);

export default User;

