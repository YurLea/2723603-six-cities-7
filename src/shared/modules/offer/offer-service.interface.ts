import type { Document } from 'mongoose';
import type { OfferEntity } from './offer.entity.js';

export interface OfferService {
  create(data: OfferEntity): Promise<Document>;
  findById(id: string): Promise<Document | null>;
}
