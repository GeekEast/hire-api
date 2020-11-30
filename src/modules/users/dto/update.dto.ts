import { IsOptional, IsString } from 'class-validator';
import { Company } from 'modules/companies/schemas/company.schema';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  confirmed_password?: string;

  @IsString()
  @IsOptional()
  company?: Company;
}
