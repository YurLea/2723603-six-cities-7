import type { Document } from 'mongoose';
import type { UserEntity } from './user.entity.js';

export interface UserService {
  create(data: UserEntity): Promise<Document>;
  findByEmail(email: string): Promise<Document | null>;
  findById(id: string): Promise<Document | null>;
}
