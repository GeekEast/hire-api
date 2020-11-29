import { IsDefined, IsString } from 'class-validator';

export class AuthenticatedUser {
  @IsDefined()
  @IsString()
  username: string;

  @IsDefined()
  @IsString()
  userId: string;
}
