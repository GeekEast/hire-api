import { CreateUserDto } from './dto/create.dto';
import { UserShowDto } from './dto/show.dto';
import { User } from 'users/schemas/user.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOne(userShowDto: UserShowDto) {
    const { username } = userShowDto;
    const user = await this.userModel.findOne({ username });
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const { password } = createUserDto;
    // TODO: store SaltOrRound in Env
    const hashed_password = await bcrypt.hash(password, 10);
    const role = createUserDto.role || 'user';
    const user = await this.userModel.create({
      ...createUserDto,
      hashed_password,
      role,
    });
    return user.save();
  }
}
