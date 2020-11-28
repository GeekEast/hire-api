import { CreateUserDto } from './../users/dto/create.dto';
import { isNil } from 'lodash';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne({ username });

    // TODO: decode hashed_password and compare
    if (user && user.hashed_password === pass) {
      const { hashed_password, ...result } = user;
      return result;
    }
    return {};
  }

  async login(user: any) {
    if (isNil(user)) return null;
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  signup(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
