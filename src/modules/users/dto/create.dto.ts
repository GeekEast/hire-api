import { Company } from 'modules/companies/schemas/company.schema';
import { IsDefined, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsDefined()
  @IsEmail()
  username: string;

  @IsDefined()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  company?: Company;
}
