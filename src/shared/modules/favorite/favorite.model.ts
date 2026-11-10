import mongoose, { Schema, model, type Model, Types } from 'mongoose';
import type { FavoriteEntity } from './favorite.entity.js';

const FavoriteSchema = new Schema<FavoriteEntity>(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true },
    offer: { type: Types.ObjectId, ref: 'Offer', required: true }
  },
  {
    timestamps: true,
    collection: 'favorites'
  }
);

FavoriteSchema.index({ user: 1, offer: 1 }, { unique: true });

export function createFavoriteModel(): Model<FavoriteEntity> {
  return (mongoose.models.Favorite as Model<FavoriteEntity>) || model<FavoriteEntity>('Favorite', FavoriteSchema);
}
