import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNumber } from 'class-validator';

export class RetrieveSchedulesDto {
  @IsNumber()
  @Type(() => Number)
  finalGoodId: number;

  @IsBoolean()
  @Transform(({ value} ) => value === 'true')
  daily: boolean;

  @IsNumber()
  @Type(() => Number)
  quantity: number;

  @IsNumber()
  @Type(() => Number)
  days: number;
}