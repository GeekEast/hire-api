import { ListUserPaginationDto } from './dto/list.dt';
import { Role } from 'modules/auth/decorators/roles.decorator';
import { RoleEnum } from 'modules/auth/enums/role.enum';
import { RolesGuard } from 'modules/auth/guards/roles.guard';
import { UpdateUserDto } from './dto/update.dto';
import { UserShowDto } from './dto/show.dto';
import { UsersService } from './users.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/username/:username')
  @Role(RoleEnum.Admin)
  @UseGuards(RolesGuard)
  async showByUsername(@Param('username') username: UserShowDto) {
    return this.usersService.findByUsername(username);
  }

  @Get('/:id')
  @Role(RoleEnum.Admin)
  @UseGuards(RolesGuard)
  show(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Get('')
  @Role(RoleEnum.Admin)
  @UseGuards(RolesGuard)
  index(@Query() listUserPagination: ListUserPaginationDto) {
    return this.usersService.findAll(listUserPagination);
  }

  @Patch('/me')
  @HttpCode(HttpStatus.OK)
  async partial_update_me(
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    return this.usersService.update(req.user, updateUserDto);
  }

  @Put('/me')
  @HttpCode(HttpStatus.OK)
  async update_me(@Body() updateUserDto: UpdateUserDto, @Request() req) {
    return this.usersService.update(req.user, updateUserDto);
  }

  @Patch('/:id')
  @Role(RoleEnum.Admin)
  @HttpCode(HttpStatus.OK)
  partial_udpate(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.adminUpdate(id, updateUserDto);
  }

  @Put('/:id')
  @Role(RoleEnum.Admin)
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.adminUpdate(id, updateUserDto);
  }

  @Delete('/:id')
  @Role(RoleEnum.Admin)
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
