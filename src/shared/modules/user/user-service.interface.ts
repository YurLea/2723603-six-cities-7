import type { Document } from 'mongoose';
import type { CreateUserDto } from './dto/create-user.dto.js';
import type { LoginUserDto } from './dto/login-user.dto.js';

export interface UserService {
  create(dto: CreateUserDto): Promise<Document>;
  findByEmail(email: string): Promise<Document | null>;
  findById(id: string): Promise<Document | null>;
  verify(dto: LoginUserDto): Promise<Document | null>;
}
