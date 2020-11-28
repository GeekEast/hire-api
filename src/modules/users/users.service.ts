import bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { UserShowDto } from './dto/show.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    if (exist_user)
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'User account already exist.',
        },
        HttpStatus.BAD_REQUEST,
      );

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
