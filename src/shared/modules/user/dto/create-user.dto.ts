import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

import { USER_TYPES } from '../../../../types/user.type.js';
import type { UserType } from '../user.entity.js';

export class CreateUserDto {
  @IsString()
  @Length(1, 15)
  public name!: string;

  @IsEmail()
  public email!: string;

  @IsOptional()
  @IsString()
  @Matches(/\.(jpg|png)$/i, {
    message: 'avatarUrl must be an image in .jpg or .png format',
  })
  public avatarUrl?: string | null;

  @IsString()
  @Length(6, 12)
  public password!: string;

  @IsIn(USER_TYPES)
  public type!: UserType;
}
