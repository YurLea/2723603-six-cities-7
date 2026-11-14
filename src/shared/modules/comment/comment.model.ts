import mongoose, { Schema, model, type Model, Types } from 'mongoose';
import type { CommentEntity } from './comment.entity.js';

const CommentSchema = new Schema<CommentEntity>(
  {
    text: { type: String, required: true },
    postDate: { type: Date, required: true },
    rating: { type: Number, required: true },
    author: { type: Types.ObjectId, ref: 'User', required: true },
    offer: { type: Types.ObjectId, ref: 'Offer', required: true },
  },
  {
    timestamps: true,
    collection: 'comments'
  }
);

export function createCommentModel(): Model<CommentEntity> {
  return (mongoose.models.Comment as Model<CommentEntity>) || model<CommentEntity>('Comment', CommentSchema);
}
