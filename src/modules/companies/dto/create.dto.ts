import { Vacancy } from 'modules/vacancies/schemas/vacancy.schema';
import { User } from 'modules/users/schemas/user.schema';
import { IsArray, IsDefined, IsOptional, IsString } from 'class-validator';

export class CreateCompanyDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsDefined()
  @IsString()
  address: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  users: User[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  vacancies: Vacancy[];
}
