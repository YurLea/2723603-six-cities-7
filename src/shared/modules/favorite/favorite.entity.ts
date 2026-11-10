import type { Types } from 'mongoose';

export type FavoriteEntity = {
  user: Types.ObjectId;
  offer: Types.ObjectId;
};
