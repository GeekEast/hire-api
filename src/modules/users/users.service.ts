import bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { UserAccountExistException } from 'exceptions';
import { UserShowDto } from './dto/show.dto';
import { isEmpty } from 'lodash';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOne(userShowDto: UserShowDto) {
    const { username } = userShowDto;
    const user = await this.userModel.findOne({ username });
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const { username, password } = createUserDto;
    const exist_user = await this.userModel.find({ username });
    if (!isEmpty(exist_user)) throw new UserAccountExistException();

    const hashed_password = await bcrypt.hash(password, 10);
    const role = 'user'; // TODO: how to create admins
    const user = await this.userModel.create({
      ...createUserDto,
      hashed_password,
      role,
    });
    return user.save();
  }
}
