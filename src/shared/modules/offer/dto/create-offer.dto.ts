import type { Goods, HousingType } from '../../../../types/offer.type.js';
import type { CityName } from '../../../../types/city.type.js';

export type CreateOfferDto = {
  title: string;
  description: string;
  postDate?: Date;

  city: CityName;

  previewImage: string;
  images: string[];

  isPremium: boolean;

  type: HousingType;
  bedrooms: number;
  maxAdults: number;
  price: number;

  goods: Goods[];

  location: {
    latitude: number;
    longitude: number;
  };

  rating?: number;
};
