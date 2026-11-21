import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsDateString,
  IsDefined,
  IsIn,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

import { CITY_NAMES, type CityName } from '../../../../types/city.type.js';
import {
  GOODS,
  HOUSING_TYPES,
  type Goods,
  type HousingType,
} from '../../../../types/offer.type.js';

export class LocationDto {
  @IsNumber()
  @IsLatitude()
  public latitude!: number;

  @IsNumber()
  @IsLongitude()
  public longitude!: number;
}

export class CreateOfferDto {
  @IsString()
  @Length(10, 100)
  public title!: string;

  @IsString()
  @Length(20, 1024)
  public description!: string;

  @IsOptional()
  @IsDateString()
  public postDate?: Date | string;

  @IsIn(CITY_NAMES)
  public city!: CityName;

  @IsString()
  @IsNotEmpty()
  public previewImage!: string;

  @IsArray()
  @ArrayMinSize(6)
  @ArrayMaxSize(6)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  public images!: string[];

  @IsBoolean()
  public isPremium!: boolean;

  @IsOptional()
  @IsBoolean()
  public isFavorite?: boolean;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(1)
  @Max(5)
  public rating?: number;

  @IsIn(HOUSING_TYPES)
  public type!: HousingType;

  @IsInt()
  @Min(1)
  @Max(8)
  public bedrooms!: number;

  @IsInt()
  @Min(1)
  @Max(10)
  public maxAdults!: number;

  @IsInt()
  @Min(100)
  @Max(100000)
  public price!: number;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsIn(GOODS, { each: true })
  public goods!: Goods[];

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  public location!: LocationDto;
}
