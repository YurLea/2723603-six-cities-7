import { inject, injectable } from 'inversify';
import type { Model, Document } from 'mongoose';

import { COMPONENTS } from '../../types.js';
import type { UserEntity } from './user.entity.js';
import type { UserService } from './user-service.interface.js';

@injectable()
export class DefaultUserService implements UserService {
  constructor(
    @inject(COMPONENTS.UserModel) private readonly userModel: Model<UserEntity>
  ) {}

  public async create(data: UserEntity): Promise<Document> {
    return this.userModel.create(data);
  }

  public async findByEmail(email: string): Promise<Document | null> {
    return this.userModel.findOne({ email }).exec();
  }

  public async findById(id: string): Promise<Document | null> {
    return this.userModel.findById(id).exec();
  }
}
