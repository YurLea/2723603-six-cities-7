import mongoose, { Schema, model, type Model } from 'mongoose';
import type { UserEntity } from './user.entity.js';

const UserSchema = new Schema<UserEntity>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatarUrl: { type: String, default: null },
    passwordHash: { type: String, required: true },
    type: { type: String, required: true, enum: ['обычный', 'pro'] }
  },
  {
    timestamps: true,
    collection: 'users'
  }
);

export function createUserModel(): Model<UserEntity> {
  return (mongoose.models.User as Model<UserEntity>) || model<UserEntity>('User', UserSchema);
}
