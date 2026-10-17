import type { MockServerData } from './mock-server-data.type.js';
import { CITY_NAMES, CITY_LOCATIONS } from '../../types/city.type.js';
import { GOODS, HOUSING_TYPES } from '../../types/offer.type.js';

import {
  getRandomArrayItems,
  getRandomBoolean,
  getRandomDateWithinDays,
  getRandomFloat,
  getRandomInt,
  getRandomItem
} from './random.js';

export class TSVOfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const city = getRandomItem(CITY_NAMES);
    const cityLocation = CITY_LOCATIONS[city];

    const title = getRandomItem(this.mockData.titles).value;
    const description = getRandomItem(this.mockData.descriptions).value;
    const postDate = getRandomDateWithinDays(30).toISOString();

    const previewImage = getRandomItem(this.mockData.previewImages).value;

    const images = getRandomArrayItems(this.mockData.images, 6)
      .map((item) => item.value)
      .join(';');

    const isPremium = String(getRandomBoolean());
    const isFavorite = String(getRandomBoolean());

    const rating = String(getRandomFloat(1, 5, 1));

    const type = getRandomItem(HOUSING_TYPES);

    const bedrooms = String(getRandomInt(1, 8));
    const maxAdults = String(getRandomInt(1, 10));

    const price = String(getRandomInt(100, 100000));

    const goods = getRandomArrayItems(GOODS, getRandomInt(1, Math.min(6, GOODS.length))).join(';');

    const authorName = getRandomItem(this.mockData.userNames).value;
    const authorEmail = getRandomItem(this.mockData.userEmails).value;
    const authorAvatar = getRandomItem(this.mockData.userAvatars).value; // может быть ""
    const authorPassword = 'qwerty1';
    const authorType = getRandomBoolean() ? 'pro' : 'обычный';

    const latitude = String(cityLocation.latitude);
    const longitude = String(cityLocation.longitude);

    return [
      title,
      description,
      postDate,
      city,
      previewImage,
      images,
      isPremium,
      isFavorite,
      rating,
      type,
      bedrooms,
      maxAdults,
      price,
      goods,
      authorName,
      authorEmail,
      authorAvatar,
      authorPassword,
      authorType,
      latitude,
      longitude
    ].join('\t');
  }
}
