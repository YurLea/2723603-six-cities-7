import { inject, injectable } from 'inversify';
import type { Model, Document } from 'mongoose';

import { COMPONENTS } from '../../types.js';
import type { OfferEntity } from './offer.entity.js';
import type { OfferService } from './offer-service.interface.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(COMPONENTS.OfferModel) private readonly offerModel: Model<OfferEntity>
  ) {}

  public async create(data: OfferEntity): Promise<Document> {
    return this.offerModel.create(data);
  }

  public async findById(id: string): Promise<Document | null> {
    return this.offerModel.findById(id).exec();
  }
}
