import { Expose, Type } from 'class-transformer';

import {
  LocationRdo,
  OfferPreviewRdo,
} from './offer-preview.rdo.js';
import { UserRdo } from '../../user/rdo/user.rdo.js';

export class OfferRdo extends OfferPreviewRdo {
  @Expose()
  public description!: string;

  @Expose()
  public images!: string[];

  @Expose()
  public bedrooms!: number;

  @Expose()
  public maxAdults!: number;

  @Expose()
  public goods!: string[];

  @Expose()
  @Type(() => UserRdo)
  public author!: UserRdo;

  @Expose()
  @Type(() => LocationRdo)
  public location!: LocationRdo;
}
