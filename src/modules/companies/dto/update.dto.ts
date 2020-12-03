import { Vacancy } from 'modules/vacancies/schemas/vacancy.schema';
import { IsOptional } from 'class-validator';

export class UpdateCompanyDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  address?: string;
}
