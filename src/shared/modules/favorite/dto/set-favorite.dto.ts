import { IsIn, IsMongoId } from 'class-validator';

export class SetFavoriteDto {
  @IsMongoId()
  public offerId!: string;

  @IsIn([0, 1])
  public status!: 0 | 1;
}
