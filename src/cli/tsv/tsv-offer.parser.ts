import type { Offer } from '../../types/offer.type.js';
import type { Goods, HousingType } from '../../types/offer.type.js';

import { CITY_LOCATIONS, isCityName } from '../../types/city.type.js';
import { isUserType } from '../../types/user.type.js';
import { isGood, isHousingType } from '../../types/offer.type.js';

export class TSVOfferParser {
  private parseBoolean(value: string): boolean {
    return value === 'true';
  }

  private parseList(value: string): string[] {
    return value.split(';').map((x) => x.trim()).filter(Boolean);
  }

  private parseHousingType(value: string): HousingType {
    if (!isHousingType(value)) {
      throw new Error(`Неизвестный тип жилья: ${value}`);
    }
    return value;
  }

  private parseGoods(value: string): Goods[] {
    const items = this.parseList(value);
    const result: Goods[] = [];

    for (const item of items) {
      if (!isGood(item)) {
        throw new Error(`Неизвестное удобство: ${item}`);
      }
      result.push(item);
    }

    return result;
  }

  public parse(line: string): Offer {
    const fields = line.split('\t');
    if (fields.length !== 21) {
      throw new Error(`Ожидалось 21 поле, получено: ${fields.length}`);
    }

    const [
      title,
      description,
      postDateRaw,
      cityRaw,
      previewImage,
      imagesRaw,
      isPremiumRaw,
      isFavoriteRaw,
      ratingRaw,
      typeRaw,
      bedroomsRaw,
      maxAdultsRaw,
      priceRaw,
      goodsRaw,
      authorName,
      authorEmail,
      authorAvatarRaw,
      authorPassword,
      authorTypeRaw,
      latitudeRaw,
      longitudeRaw,
    ] = fields;

    if (!isCityName(cityRaw)) {
      throw new Error(`Неизвестный город: ${cityRaw}`);
    }

    if (!isUserType(authorTypeRaw)) {
      throw new Error(`Неизвестный тип пользователя: ${authorTypeRaw}`);
    }

    const images = this.parseList(imagesRaw);
    if (images.length !== 6) {
      throw new Error(`images должен содержать 6 ссылок, сейчас: ${images.length}`);
    }

    return {
      title,
      description,
      postDate: new Date(postDateRaw),

      city: {
        name: cityRaw,
        location: CITY_LOCATIONS[cityRaw],
      },

      previewImage,
      images,

      isPremium: this.parseBoolean(isPremiumRaw),
      isFavorite: this.parseBoolean(isFavoriteRaw),

      rating: Number(ratingRaw),
      type: this.parseHousingType(typeRaw),

      bedrooms: Number(bedroomsRaw),
      maxAdults: Number(maxAdultsRaw),

      price: Number(priceRaw),
      goods: this.parseGoods(goodsRaw),

      author: {
        name: authorName,
        email: authorEmail,
        avatarUrl: authorAvatarRaw ? authorAvatarRaw : undefined,
        password: authorPassword,
        type: authorTypeRaw,
      },

      commentsCount: 0,

      location: {
        latitude: Number(latitudeRaw),
        longitude: Number(longitudeRaw),
      },
    };
  }
}
