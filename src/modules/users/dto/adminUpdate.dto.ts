import { Company } from 'modules/companies/schemas/company.schema';
import { IsOptional, IsString } from 'class-validator';
import { RoleEnum } from 'modules/auth/enums/role.enum';

export class AdminUpdateUserDto {
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

  @IsString()
  @IsOptional()
  role?: string;
}
