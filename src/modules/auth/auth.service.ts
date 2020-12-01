import bcrypt from 'bcrypt';
import { AuthenticatedUser } from './dto/authenticated.dto';
import { CreateUserDto } from 'modules/users/dto/create.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { isNil } from 'lodash';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login.dto';
import { UsersService } from 'modules/users/users.service';
import { get } from 'lodash';
import {
  AccountPasswordNotMatchException,
  UserNotFoundException,
} from 'exceptions';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUserByPassword({
    username,
    password,
  }: LoginUserDto): Promise<AuthenticatedUser> {
    const user = await this.usersService.findByUsername({ username });
    if (!user) throw new UserNotFoundException();
    const passed = await bcrypt.compare(password, user.hashed_password);
    if (!passed) throw new AccountPasswordNotMatchException();
    return {
      username: user.username,
      userId: get(user, ['_id']),
      role: user.role,
    };
  }

  async generateJwt(user: {
    username: string;
    user_id: string;
    role: string;
  }): Promise<{ access_token: string }> {
    if (isNil(user)) return null;
    const payload = {
      username: user.username,
      sub: user.user_id,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }
}
