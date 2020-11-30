import { ListUserPaginationDto } from './dto/list.dt';
import { Role } from 'modules/auth/enums/role.enum';
import { Roles } from 'modules/auth/decorators/roles.decorator';
import { UpdateUserDto } from './dto/update.dto';
import { UserShowDto } from './dto/show.dto';
import { UsersService } from './users.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Put,
  Request,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/username/:username')
  showByUsername(@Param('username') username: UserShowDto) {
    return this.usersService.findByUsername(username);
  }

  @Get('/:id')
  show(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Get('')
  index(listUserPagination: ListUserPaginationDto) {
    this.usersService.findAll(listUserPagination);
  }

  @Patch('/me')
  @HttpCode(HttpStatus.OK)
  async partialUpdateMyAccount(
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    return this.usersService.update(req.user, updateUserDto);
  }

  @Put('/me')
  @HttpCode(HttpStatus.OK)
  async updateMyAccount(@Body() updateUserDto: UpdateUserDto, @Request() req) {
    return this.usersService.update(req.user, updateUserDto);
  }

  // TODO: add role-based authorization
  @Patch('/:id')
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK)
  partialUpdateAccount(@Param('id') id: string, UpdateUserDto) {
    return;
  }

  // TODO: add role-based authorization
  @Put('/:id')
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK)
  updateAccount(@Param('id') id: string, UpdateUserDto) {
    return;
  }
}
