import { IsNumber, IsOptional } from 'class-validator';

export class ShowCompanyVacancies {
  @IsOptional()
  @IsNumber()
  skip: number;

  @IsOptional()
  @IsNumber()
  limit: number;
}
