import bcrypt from 'bcrypt';
import { AuthenticatedUser } from './dto/authenticated_user.dto';
import { CreateUserDto } from 'modules/users/dto/create.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { isNil } from 'lodash';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login.dto';
import { UsersService } from 'modules/users/users.service';

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
    const user = await this.usersService.findOne({ username });
    if (!user) throw new UnauthorizedException();
    const passed = await bcrypt.compare(password, user.hashed_password);
    if (!passed) throw new UnauthorizedException();
    return { username: user.username, userId: user._id };
  }

  async generateJwt(user: {
    username: string;
    user_id: string;
  }): Promise<{ access_token: string }> {
    if (isNil(user)) return null;
    const payload = { username: user.username, sub: user.user_id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async signup(createUserDto: CreateUserDto) {
    await this.usersService.create(createUserDto);
  }
}
