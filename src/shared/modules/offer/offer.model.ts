import mongoose, { Schema, model, type Model, Types } from 'mongoose';
import type { OfferEntity, Location, City } from './offer.entity.js';

const LocationSchema = new Schema<Location>(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  { _id: false }
);

const CitySchema = new Schema<City>(
  {
    name: { type: String, required: true },
    location: { type: LocationSchema, required: true }
  },
  { _id: false }
);

const OfferSchema = new Schema<OfferEntity>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    postDate: { type: Date, required: true },

    city: { type: CitySchema, required: true },

    previewImage: { type: String, required: true },
    images: { type: [String], required: true },

    isPremium: { type: Boolean, required: true },
    isFavorite: { type: Boolean, required: true },

    rating: { type: Number, required: true },
    type: { type: String, required: true },

    bedrooms: { type: Number, required: true },
    maxAdults: { type: Number, required: true },

    price: { type: Number, required: true },
    goods: { type: [String], required: true },

    author: { type: Types.ObjectId, ref: 'User', required: true },
    commentsCount: { type: Number, required: true, default: 0 },

    location: { type: LocationSchema, required: true }
  },
  {
    timestamps: true,
    collection: 'offers'
  }
);

export function createOfferModel(): Model<OfferEntity> {
  return (mongoose.models.Offer as Model<OfferEntity>) || model<OfferEntity>('Offer', OfferSchema);
}
