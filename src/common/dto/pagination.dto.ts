import { IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  take?: number;

  @IsOptional()
  @IsPositive()
  offset?: number;
}
