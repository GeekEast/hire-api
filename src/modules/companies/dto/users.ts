import { IsNumber, IsOptional } from 'class-validator';

export class ShowCompanyUserDto {
  @IsOptional()
  @IsNumber()
  skip: number;

  @IsOptional()
  @IsNumber()
  limit: number;
}
