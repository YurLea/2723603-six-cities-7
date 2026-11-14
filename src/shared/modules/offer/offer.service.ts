import { inject, injectable } from 'inversify';
import type { Model, Document } from 'mongoose';

import { COMPONENTS } from '../../types.js';
import type { OfferEntity } from './offer.entity.js';
import type { OfferService } from './offer-service.interface.js';

import type { CreateOfferDto } from './dto/create-offer.dto.js';
import type { UpdateOfferDto } from './dto/update-offer.dto.js';

import { CITY_LOCATIONS, isCityName } from '../../../types/city.type.js';
import type { FavoriteService } from '../favorite/favorite-service.interface.js';
import type { CommentService } from '../comment/comment-service.interface.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(COMPONENTS.OfferModel) private readonly offerModel: Model<OfferEntity>,
    @inject(COMPONENTS.FavoriteService) private readonly favoriteService: FavoriteService,
    @inject(COMPONENTS.CommentService) private readonly commentService: CommentService,
  ) {}

  public async find(limit = 60): Promise<Document[]> {
    return this.offerModel
      .find()
      .sort({ postDate: -1 })
      .limit(limit)
      .populate('author', 'name email avatarUrl type')
      .exec();
  }

  public async findById(offerId: string): Promise<Document | null> {
    return this.offerModel
      .findById(offerId)
      .populate('author', 'name email avatarUrl type')
      .exec();
  }

  public async create(dto: CreateOfferDto, authorId: string): Promise<Document> {
    if (!isCityName(dto.city)) {
      throw new Error(`Unknown city: ${dto.city}`);
    }

    return this.offerModel.create({
      title: dto.title,
      description: dto.description,
      postDate: dto.postDate ?? new Date(),

      city: {
        name: dto.city,
        location: CITY_LOCATIONS[dto.city],
      },

      previewImage: dto.previewImage,
      images: dto.images,

      isPremium: dto.isPremium,
      isFavorite: false,

      rating: dto.rating ?? 0,
      type: dto.type,

      bedrooms: dto.bedrooms,
      maxAdults: dto.maxAdults,

      price: dto.price,
      goods: dto.goods,

      author: authorId as any,
      commentsCount: 0,

      location: dto.location,
    });
  }

  public async updateById(offerId: string, dto: UpdateOfferDto, userId: string): Promise<Document> {
    const offer = await this.offerModel.findById(offerId).exec();
    if (!offer) {
      throw new Error('Offer not found');
    }
    if (String(offer.author) !== userId) {
      throw new Error('Forbidden');
    }

    const updateData: Partial<OfferEntity> = {};

    if (dto.title !== undefined) {
      updateData.title = dto.title;
    }
    if (dto.description !== undefined) {
      updateData.description = dto.description;
    }
    if (dto.previewImage !== undefined) {
      updateData.previewImage = dto.previewImage;
    }
    if (dto.images !== undefined) {
      updateData.images = dto.images;
    }
    if (dto.isPremium !== undefined) {
      updateData.isPremium = dto.isPremium;
    }
    if (dto.type !== undefined) {
      updateData.type = dto.type;
    }
    if (dto.bedrooms !== undefined) {
      updateData.bedrooms = dto.bedrooms;
    }
    if (dto.maxAdults !== undefined) {
      updateData.maxAdults = dto.maxAdults;
    }
    if (dto.price !== undefined) {
      updateData.price = dto.price;
    }
    if (dto.goods !== undefined) {
      updateData.goods = dto.goods;
    }
    if (dto.location !== undefined) {
      updateData.location = dto.location;
    }

    if (dto.city !== undefined) {
      if (!isCityName(dto.city)) {
        throw new Error(`Unknown city: ${dto.city}`);
      }
      updateData.city = {
        name: dto.city,
        location: CITY_LOCATIONS[dto.city],
      };
    }

    const updated = await this.offerModel.findByIdAndUpdate(
      offerId,
      updateData,
      { new: true }
    ).populate('author', 'name email avatarUrl type').exec();

    if (!updated) {
      throw new Error('Offer not found');
    }

    return updated;
  }

  public async deleteById(offerId: string, userId: string): Promise<void> {
    const offer = await this.offerModel.findById(offerId).exec();
    if (!offer) {
      throw new Error('Offer not found');
    }
    if (String(offer.author) !== userId) {
      throw new Error('Forbidden');
    }

    await this.commentService.clearByOfferId(offerId);
    await this.favoriteService.clearByOfferId(offerId);

    await this.offerModel.deleteOne({ _id: offerId }).exec();
  }

  public async findPremiumByCity(city: any): Promise<Document[]> {
    if (!isCityName(city)) {
      throw new Error(`Unknown city: ${city}`);
    }

    return this.offerModel
      .find({ 'city.name': city, isPremium: true })
      .sort({ postDate: -1 })
      .limit(3)
      .populate('author', 'name email avatarUrl type')
      .exec();
  }

  public async findFavorites(userId: string): Promise<Document[]> {
    const offerIds = await this.favoriteService.findOfferIds(userId);
    if (offerIds.length === 0) {
      return [];
    }

    return this.offerModel
      .find({ _id: { $in: offerIds } })
      .sort({ postDate: -1 })
      .populate('author', 'name email avatarUrl type')
      .exec();
  }
}
