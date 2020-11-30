import bcrypt from 'bcrypt';
import { Company } from 'modules/companies/schemas/company.schema';
import { CreateUserDto } from './dto/create.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isEmpty } from 'lodash';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { UserAccountExistException } from 'exceptions';
import { UserShowDto } from './dto/show.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Company.name) private companyModel: Model<Company>,
  ) {}

  async findOne(userShowDto: UserShowDto) {
    const { username } = userShowDto;
    const user = await this.userModel.findOne({ username });
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const { username, password, company } = createUserDto;
    const exist_user = await this.userModel.find({ username });
    if (!isEmpty(exist_user)) throw new UserAccountExistException();

    const hashed_password = await bcrypt.hash(password, 10);
    const role = 'user'; // TODO: how to create admins

    // create user
    const user = await this.userModel.create({
      ...createUserDto,
      hashed_password,
      role,
      company,
    });

    // update company
    await this.companyModel.findByIdAndUpdate(
      user.company,
      {
        $push: { users: user._id },
      },
      { new: true },
    );
  }
}
