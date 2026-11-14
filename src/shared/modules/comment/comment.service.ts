import { inject, injectable } from 'inversify';
import type { Model, Document } from 'mongoose';
import { Types } from 'mongoose';
import { COMPONENTS } from '../../types.js';
import type { CommentEntity } from './comment.entity.js';
import type { CommentService } from './comment-service.interface.js';
import type { CreateCommentDto } from './dto/create-comment.dto.js';
import type { OfferEntity } from '../offer/offer.entity.js';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(COMPONENTS.CommentModel) private readonly commentModel: Model<CommentEntity>,
    @inject(COMPONENTS.OfferModel) private readonly offerModel: Model<OfferEntity>,
  ) {}

  public async findByOfferId(offerId: string, limit = 50): Promise<Document[]> {
    return this.commentModel
      .find({ offer: offerId })
      .sort({ postDate: -1 })
      .limit(limit)
      .populate('author', 'name email avatarUrl type')
      .exec();
  }

  public async create(dto: CreateCommentDto, offerId: string, userId: string): Promise<Document> {
    const created = await this.commentModel.create({
      text: dto.text,
      rating: dto.rating,
      offer: offerId as any,
      author: userId as any,
      postDate: new Date(),
    });

    await this.recalculateOfferStats(offerId);

    return created;
  }

  public async clearByOfferId(offerId: string): Promise<void> {
    await this.commentModel.deleteMany({ offer: offerId }).exec();
    await this.recalculateOfferStats(offerId);
  }

  private async recalculateOfferStats(offerId: string): Promise<void> {
    const stats = await this.commentModel.aggregate([
      { $match: { offer: this.toObjectId(offerId) } },
      {
        $group: {
          _id: '$offer',
          count: { $sum: 1 },
          avgRating: { $avg: '$rating' }
        }
      }
    ]).exec();

    const count = stats[0]?.count ?? 0;
    const avgRating = stats[0]?.avgRating ?? 0;
    const rating = Math.round(avgRating * 10) / 10;

    await this.offerModel.updateOne(
      { _id: offerId },
      { commentsCount: count, rating }
    ).exec();
  }

  private toObjectId(id: string): Types.ObjectId {
    return new Types.ObjectId(id);
  }
}
