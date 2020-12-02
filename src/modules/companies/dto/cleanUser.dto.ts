import { IsDefined, IsString } from 'class-validator';

export class RemoveUserFromCompaniesDto {
  @IsDefined()
  @IsString()
  userId: string;
}
