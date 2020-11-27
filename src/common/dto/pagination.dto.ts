import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  @IsOptional()
  @IsPositive()
  take?: number;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  offset?: number;
}
