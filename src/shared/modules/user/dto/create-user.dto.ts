import type { UserType } from '../user.entity.js';

export type CreateUserDto = {
  name: string;
  email: string;
  avatarUrl?: string | null;
  password: string;
  type: UserType;
};
