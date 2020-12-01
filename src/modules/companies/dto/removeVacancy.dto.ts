import { IsDefined, IsString } from 'class-validator';
import { Vacancy } from 'modules/vacancies/schemas/vacancy.schema';

export class RemoveVacancyFromCompanyDto {
  @IsString()
  @IsDefined()
  companyId: string;

  @IsDefined()
  vacancy: Vacancy;
}
