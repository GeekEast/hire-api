import { UsersService } from 'users/users.service';
import {
  Controller,
  HttpCode,
  Post,
  Request,
  UseGuards,
  HttpStatus,
  Get,
  Body,
} from '@nestjs/common';
import { CreateUserDto } from 'users/dto/create.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('/signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }
}
