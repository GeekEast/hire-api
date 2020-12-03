import { IsDefined, IsString } from 'class-validator';

export class RemoveVacancyFromCompanyDto {
  @IsString()
  @IsDefined()
  companyId: string;

  @IsDefined()
  @IsString()
  vacancy: string;
}
