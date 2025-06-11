import mongoose, { Schema, Document } from 'mongoose';

interface ICity {
  name: string;
  description?: string;
  imageUrl?: string;
}

export interface ICountry extends Document {
  name: string;
  code: string;
  description: string;
  headerImageUrl: string;
  cities: ICity[];
  createdAt: Date;
  updatedAt: Date;
}

const CountrySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    minlength: 2,
    maxlength: 3
  },
  continent: {
    type: String,
    required: true,
    enum: ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania'],
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  headerImageUrl: {
    type: String,
    required: true
  },
}, {
  timestamps: true
});

// Index for faster queries
CountrySchema.index({ code: 1 });
CountrySchema.index({ name: 1 });

const Country = mongoose.model<ICountry>('Country', CountrySchema);

export default Country;