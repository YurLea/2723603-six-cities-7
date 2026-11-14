import type { Types } from 'mongoose';

export interface FavoriteService {
  add(userId: string, offerId: string): Promise<void>;
  remove(userId: string, offerId: string): Promise<void>;
  findOfferIds(userId: string): Promise<Types.ObjectId[]>;
  exists(userId: string, offerId: string): Promise<boolean>;
  clearByOfferId(offerId: string): Promise<void>;
}
