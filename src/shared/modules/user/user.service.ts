import { inject, injectable } from 'inversify';
import type { Model, Document } from 'mongoose';

import { COMPONENTS } from '../../types.js';
import type { UserEntity } from './user.entity.js';
import type { UserService } from './user-service.interface.js';
import type { CreateUserDto } from './dto/create-user.dto.js';
import type { LoginUserDto } from './dto/login-user.dto.js';
import { ConfigService } from '../../config/config.service.js';
import { createSha256 } from '../../helpers/hash.js';

@injectable()
export class DefaultUserService implements UserService {
  constructor(
    @inject(COMPONENTS.UserModel) private readonly userModel: Model<UserEntity>,
    @inject(COMPONENTS.Config) private readonly config: ConfigService,
  ) {}

  public async create(dto: CreateUserDto): Promise<Document> {
    const passwordHash = createSha256(dto.password, this.config.getSalt());

    return this.userModel.create({
      name: dto.name,
      email: dto.email,
      avatarUrl: dto.avatarUrl ?? null,
      type: dto.type,
      passwordHash,
    });
  }

  public async findByEmail(email: string): Promise<Document | null> {
    return this.userModel.findOne({ email }).exec();
  }

  public async findById(id: string): Promise<Document | null> {
    return this.userModel.findById(id).exec();
  }

  public async verify(dto: LoginUserDto): Promise<Document | null> {
    const user = await this.userModel.findOne({ email: dto.email }).exec();
    if (!user) {
      return null;
    }

    const passwordHash = createSha256(dto.password, this.config.getSalt());
    return user.passwordHash === passwordHash ? user : null;
  }
}
