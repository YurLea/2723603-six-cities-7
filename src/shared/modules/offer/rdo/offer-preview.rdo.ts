import { Expose, Type } from 'class-transformer';

export class LocationRdo {
  @Expose()
  public latitude!: number;

  @Expose()
  public longitude!: number;
}

export class CityRdo {
  @Expose()
  public name!: string;

  @Expose()
  @Type(() => LocationRdo)
  public location!: LocationRdo;
}

export class OfferPreviewRdo {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public type!: string;

  @Expose()
  public price!: number;

  @Expose()
  public postDate!: string;

  @Expose()
  @Type(() => CityRdo)
  public city!: CityRdo;

  @Expose()
  public previewImage!: string;

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public isFavorite!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public commentsCount!: number;
}
