import { RoleEnum } from './../../auth/enums/role.enum';
import { IsEnum, IsOptional, IsString } from 'class-validator';
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

  @IsOptional()
  @IsString()
  @IsEnum(RoleEnum)
  role?: string;
}
