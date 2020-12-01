import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { Company } from 'modules/companies/schemas/company.schema';

export class UpdateVacancyDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsNumber()
  @IsOptional()
  description: string;

  @IsDate()
  @IsOptional()
  expiredAt: Date;

  @IsString()
  @IsOptional()
  company?: Company;
}
