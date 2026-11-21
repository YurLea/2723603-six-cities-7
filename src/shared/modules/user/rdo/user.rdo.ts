import { Expose } from 'class-transformer';
import type { UserType } from '../user.entity.js';

export class UserRdo {
  @Expose()
  public id!: string;

  @Expose()
  public name!: string;

  @Expose()
  public email!: string;

  @Expose()
  public avatarUrl!: string | null;

  @Expose()
  public type!: UserType;
}
