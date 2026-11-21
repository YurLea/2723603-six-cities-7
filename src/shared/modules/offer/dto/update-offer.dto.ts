import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
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
import { LocationDto } from './create-offer.dto.js';

export class UpdateOfferDto {
  @IsOptional()
  @IsString()
  @Length(10, 100)
  public title?: string;

  @IsOptional()
  @IsString()
  @Length(20, 1024)
  public description?: string;

  @IsOptional()
  @IsIn(CITY_NAMES)
  public city?: CityName;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public previewImage?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(6)
  @ArrayMaxSize(6)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  public images?: string[];

  @IsOptional()
  @IsBoolean()
  public isPremium?: boolean;

  @IsOptional()
  @IsBoolean()
  public isFavorite?: boolean;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(1)
  @Max(5)
  public rating?: number;

  @IsOptional()
  @IsIn(HOUSING_TYPES)
  public type?: HousingType;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(8)
  public bedrooms?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  public maxAdults?: number;

  @IsOptional()
  @IsInt()
  @Min(100)
  @Max(100000)
  public price?: number;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsIn(GOODS, { each: true })
  public goods?: Goods[];

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  public location?: LocationDto;
}
