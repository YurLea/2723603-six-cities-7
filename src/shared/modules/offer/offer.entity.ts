import type { Types } from 'mongoose';

export type Location = {
  latitude: number;
  longitude: number;
};

export type City = {
  name: string;
  location: Location;
};

export type OfferEntity = {
  title: string;
  description: string;
  postDate: Date;

  city: City;

  previewImage: string;
  images: string[];

  isPremium: boolean;
  isFavorite: boolean;

  rating: number;
  type: string;

  bedrooms: number;
  maxAdults: number;

  price: number;
  goods: string[];

  author: Types.ObjectId;
  commentsCount: number;

  location: Location;
};
