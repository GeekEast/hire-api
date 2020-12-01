import { Vacancy } from 'modules/vacancies/schemas/vacancy.schema';
import { IsDefined, IsString } from 'class-validator';

export class AddVacancyToCompanyDto {
  @IsString()
  @IsDefined()
  companyId: string;

  @IsDefined()
  vacancy: Vacancy;
}
