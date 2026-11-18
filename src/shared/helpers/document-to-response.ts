import type { Document } from 'mongoose';

import type { OfferEntity } from '../modules/offer/offer.entity.js';
import type { UserEntity } from '../modules/user/user.entity.js';
import { UserRdo } from '../modules/user/rdo/user.rdo.js';
import { OfferRdo } from '../modules/offer/rdo/offer.rdo.js';
import { OfferPreviewRdo } from '../modules/offer/rdo/offer-preview.rdo.js';
import { fillRdo } from './fill-rdo.js';

type UserRecord = UserEntity & {
  _id: unknown;
};

type OfferRecord = Omit<OfferEntity, 'author'> & {
  _id: unknown;
  author: UserRecord;
};

export function userToResponse(document: Document): UserRdo {
  const user = document.toObject<UserRecord>();

  return fillRdo(UserRdo, {
    ...user,
    id: String(user._id),
    avatarUrl: user.avatarUrl ?? null,
  });
}

export function offerPreviewToResponse(
  document: Document,
  isFavorite: boolean
): OfferPreviewRdo {
  const offer = document.toObject<OfferRecord>();

  return fillRdo(OfferPreviewRdo, {
    ...offer,
    id: String(offer._id),
    postDate: new Date(offer.postDate).toISOString(),
    isFavorite,
  });
}

export function offerToResponse(
  document: Document,
  isFavorite: boolean
): OfferRdo {
  const offer = document.toObject<OfferRecord>();

  return fillRdo(OfferRdo, {
    ...offer,
    id: String(offer._id),
    postDate: new Date(offer.postDate).toISOString(),
    isFavorite,
    author: {
      ...offer.author,
      id: String(offer.author._id),
      avatarUrl: offer.author.avatarUrl ?? null,
    },
  });
}
