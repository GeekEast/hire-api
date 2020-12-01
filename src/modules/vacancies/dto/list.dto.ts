import { IsNumber, IsOptional } from 'class-validator';

export class ListVacancyPaginationDto {
  @IsOptional()
  @IsNumber()
  limit: number;

  @IsOptional()
  @IsNumber()
  skip: number;
}
