import { IsDefined, IsString } from 'class-validator';
export class RemoveUserFromCompanyDto {
  @IsString()
  @IsDefined()
  companyId: string;

  @IsString()
  @IsDefined()
  userId: string;
}
