import { AuthService } from './auth.service';
import { CreateUserDto } from 'modules/users/dto/create.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SkipJwt } from 'decorators/SkipJwt';
import { UpdateUserDto } from 'modules/users/dto/update.dto';
import {
  Controller,
  HttpCode,
  Post,
  Request,
  UseGuards,
  HttpStatus,
  Body,
  Get,
  Param,
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

  @Post('/my_account_update')
  @HttpCode(HttpStatus.OK)
  async updateMyAccount(@Body() updateUserDto: UpdateUserDto, @Request() req) {
    return this.authService.updateMyAccountByUsername(req.user, updateUserDto);
  }

  // TODO: add role-based authorization
  @Post('/account_update/:id')
  @HttpCode(HttpStatus.OK)
  updateAccount(@Param('id') id: string, UpdateUserDto) {
    return;
  }
}
