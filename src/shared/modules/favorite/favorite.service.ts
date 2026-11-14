import { inject, injectable } from 'inversify';
import type { Model, Types } from 'mongoose';

import { COMPONENTS } from '../../types.js';
import type { FavoriteEntity } from './favorite.entity.js';
import type { FavoriteService } from './favorite-service.interface.js';

@injectable()
export class DefaultFavoriteService implements FavoriteService {
  constructor(
    @inject(COMPONENTS.FavoriteModel) private readonly favoriteModel: Model<FavoriteEntity>
  ) {}

  public async add(userId: string, offerId: string): Promise<void> {
    await this.favoriteModel.updateOne(
      { user: userId, offer: offerId },
      { $setOnInsert: { user: userId, offer: offerId } },
      { upsert: true }
    ).exec();
  }

  public async remove(userId: string, offerId: string): Promise<void> {
    await this.favoriteModel.deleteOne({ user: userId, offer: offerId }).exec();
  }

  public async exists(userId: string, offerId: string): Promise<boolean> {
    const doc = await this.favoriteModel.findOne({ user: userId, offer: offerId }).select('_id').exec();
    return Boolean(doc);
  }

  public async findOfferIds(userId: string): Promise<Types.ObjectId[]> {
    const docs = await this.favoriteModel.find({ user: userId }).select('offer -_id').exec();
    return docs.map((d) => d.offer as Types.ObjectId);
  }

  public async clearByOfferId(offerId: string): Promise<void> {
    await this.favoriteModel.deleteMany({ offer: offerId }).exec();
  }
}
