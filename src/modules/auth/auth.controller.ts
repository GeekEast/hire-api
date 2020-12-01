import { AuthService } from './auth.service';
import { CreateUserDto } from 'modules/users/dto/create.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SkipJwt } from 'modules/auth/decorators/skipJwt.decorator';
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
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  @SkipJwt()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async signin(@Request() req) {
    return this.authService.generateJwt(req.user);
  }

  @Post('/signup')
  @SkipJwt()
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @Get('/auth/validate')
  @HttpCode(HttpStatus.OK)
  authenticate() {
    return;
  }
}
