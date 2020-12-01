import { Vacancy } from 'modules/vacancies/schemas/vacancy.schema';
import { User } from 'modules/users/schemas/user.schema';
import { IsOptional } from 'class-validator';

export class UpdateCompanyDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  address?: string;

  @IsOptional()
  users?: User[];

  @IsOptional()
  vacancies?: Vacancy[];
}
