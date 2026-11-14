import type { Types } from 'mongoose';

export type CommentEntity = {
  text: string;
  postDate: Date;
  rating: number;
  author: Types.ObjectId;
  offer: Types.ObjectId;
};
