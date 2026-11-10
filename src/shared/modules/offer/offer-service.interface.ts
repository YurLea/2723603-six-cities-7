import type { Document } from 'mongoose';
import type { CreateOfferDto } from './dto/create-offer.dto.js';
import type { UpdateOfferDto } from './dto/update-offer.dto.js';
import type { CityName } from '../../../types/city.type.js';

export interface OfferService {
  find(limit?: number): Promise<Document[]>;
  findById(offerId: string): Promise<Document | null>;

  create(dto: CreateOfferDto, authorId: string): Promise<Document>;

  updateById(offerId: string, dto: UpdateOfferDto, userId: string): Promise<Document>;
  deleteById(offerId: string, userId: string): Promise<void>;

  findPremiumByCity(city: CityName): Promise<Document[]>;
  findFavorites(userId: string): Promise<Document[]>;
}
