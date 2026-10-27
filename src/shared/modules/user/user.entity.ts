export type UserType = 'обычный' | 'pro';

export type UserEntity = {
  name: string;
  email: string;
  avatarUrl?: string | null;
  passwordHash: string;
  type: UserType;
};
