import { IsNumber, IsOptional } from 'class-validator';

export class ListUserPaginationDto {
  @IsOptional()
  @IsNumber()
  limit: number;
  @IsOptional()
  @IsNumber()
  skip: number;
}
