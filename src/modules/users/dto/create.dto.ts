import { Company } from 'modules/companies/schemas/company.schema';
import { IsDefined, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsDefined()
  username: string;

  @IsDefined()
  @IsString()
  password: string;

  @IsDefined()
  @IsString()
  confirmed_password: string;

  @IsOptional()
  @IsString()
  company?: Company;
}
