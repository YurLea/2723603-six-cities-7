export const USER_TYPES = ['обычный', 'pro'] as const;
export type UserType = typeof USER_TYPES[number];

export type User = {
  name: string;
  email: string;
  avatarUrl?: string;
  password: string;
  type: UserType;
};

export function isUserType(value: string): value is UserType {
  return USER_TYPES.some((t) => t === value);
}
