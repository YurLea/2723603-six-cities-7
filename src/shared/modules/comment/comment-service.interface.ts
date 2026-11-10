import type { Document } from 'mongoose';
import type { CreateCommentDto } from './dto/create-comment.dto.js';

export interface CommentService {
  findByOfferId(offerId: string, limit?: number): Promise<Document[]>;
  create(dto: CreateCommentDto, offerId: string, userId: string): Promise<Document>;
  clearByOfferId(offerId: string): Promise<void>;
}
