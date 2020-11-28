import { UserShowDto } from './dto/show.dto';
import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/:username')
  show(@Param('username') username: UserShowDto) {
    return this.usersService.findOne(username);
  }
}
