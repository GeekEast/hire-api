import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'modules/users/dto/create.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import {
  Controller,
  HttpCode,
  Post,
  Request,
  UseGuards,
  HttpStatus,
  Body,
  Get,
} from '@nestjs/common';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Request() req) {
    return this.authService.generateJwt(req.user);
  }

  @Post('/signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/validate')
  authenticate() {
    return;
  }
}
