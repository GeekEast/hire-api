import { User } from 'modules/users/schemas/user.schema';
import { IsDefined, IsString } from 'class-validator';

export class AddUserToCompanyDto {
  @IsString()
  @IsDefined()
  companyId: string;

  @IsDefined()
  user: User;
}
