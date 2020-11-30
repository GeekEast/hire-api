import bcrypt from 'bcrypt';
import { CompaniesService } from 'modules/companies/companies.service';
import { CreateUserDto } from './dto/create.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isEmpty, pick } from 'lodash';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update.dto';
import { User } from './schemas/user.schema';
import { UserShowDto } from './dto/show.dto';
import {
  AccountPasswordNotMatchConfirmException,
  UserAccountExistException,
} from 'exceptions';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly companyService: CompaniesService,
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

    // add user to company
    await this.companyService.addUserToCompany({
      companyId: company as any,
      user: user._id,
    });
    return this.safeUser(user);
  }

  async update(userShowDto: UserShowDto, updateUserDto: UpdateUserDto) {
    const { id, company: prevCompany } = await this.findOne(userShowDto);
    const {
      password,
      confirmed_password,
      company: currCompany,
    } = updateUserDto;
    if (password !== confirmed_password)
      throw new AccountPasswordNotMatchConfirmException();

    let user;
    try {
      user = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
        new: true,
        useFindAndModify: false,
      });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.FORBIDDEN);
    }

    await this.companyService.addUserToCompany({
      companyId: prevCompany as any,
      user: user._id,
    });
    await this.companyService.removeUserFromCompany({
      companyId: currCompany as any,
      userId: user._id,
    });
    return this.safeUser(user);
  }

  private async safeUser(user: User) {
    return pick(user, ['_id', 'username', 'name', 'role', 'company']);
  }
}
