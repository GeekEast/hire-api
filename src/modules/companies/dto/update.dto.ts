import { IsOptional } from 'class-validator';

export class UpdateCompanyDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  address?: string;
}
