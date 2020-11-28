import { IsDefined, IsString, IsEmail } from 'class-validator';

export class CreateUserDto {Î
  @IsDefined()
  @IsString()
  name: string;

  @IsDefined()
  @IsEmail()
  username: string;

  @IsDefined()
  @IsString()
  password: string;
}
