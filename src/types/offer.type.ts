import type { City, Location } from './city.type.js';
import type { User } from './user.type.js';

export const HOUSING_TYPES = ['apartment', 'house', 'room', 'hotel'] as const;
export type HousingType = typeof HOUSING_TYPES[number];

export const GOODS = [
  'Breakfast',
  'Air conditioning',
  'Laptop friendly workspace',
  'Baby seat',
  'Washer',
  'Towels',
  'Fridge',
] as const;
export type Goods = typeof GOODS[number];

export type Offer = {
  title: string;
  description: string;
  postDate: Date;

  city: City;

  previewImage: string;
  images: string[];

  isPremium: boolean;
  isFavorite: boolean;

  rating: number;
  type: HousingType;

  bedrooms: number;
  maxAdults: number;

  price: number;
  goods: Goods[];

  author: User;

  commentsCount: number;
  location: Location;
};

export function isHousingType(value: string): value is HousingType {
  return HOUSING_TYPES.some((t) => t === value);
}

export function isGood(value: string): value is Goods {
  return GOODS.some((g) => g === value);
}
