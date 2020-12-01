import { IsDefined, IsOptional, IsString, IsDate } from 'class-validator';
import { Company } from 'modules/companies/schemas/company.schema';

export class CreateVacancyDto {
  @IsDefined()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsDate()
  @IsOptional()
  expiredAt: Date;

  @IsOptional()
  @IsString()
  company?: Company;
}
