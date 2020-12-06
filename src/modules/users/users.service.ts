import bcrypt from 'bcrypt';
import { ClientSession, Model } from 'mongoose';
import { CreateUserDto } from './dto/create.dto';
import { InjectModel } from '@nestjs/mongoose';
import { pick, pickBy } from 'lodash';
import { UpdateUserDto } from './dto/update.dto';
import { User } from './schemas/user.schema';
import { UserShowDto } from './dto/show.dto';
import { UserSortDto } from './dto/sort.dto';

import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  AccountPasswordNotMatchConfirmException,
  UserAccountExistException,
} from 'exceptions/custom';
import _ from 'lodash';
import { AdminUpdateUserDto } from './dto/adminUpdate.dto';

@Injectable()
export class UsersService {
  safe_attributes: string[];
  safe_slim_company_attributes: string[];
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {
    this.safe_attributes = ['id', 'username', 'name', 'role', 'company'];
    this.safe_slim_company_attributes = ['id', 'name', 'address'];
  }

  async findByUsername(userShowDto: UserShowDto) {
    const user = await this.unsafeFindByUsername(userShowDto);
    return this.permit(user);
  }

  async findById(id: string) {
    const user = await this.unsafeFindById(id);
    return this.permit(user);
  }

  async findAll(listUserPagination: {
    limit?: number;
    skip?: number;
    populate?: number;
    sort?: UserSortDto;
  }) {
    const { limit, skip, populate, sort } = listUserPagination;
    return await this.userModel
      .find()
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate(
        !!populate ? 'company' : 'dto',
        this.safe_slim_company_attributes,
      )
      .select(this.safe_attributes);
  }

  async findCompany(id: string) {
    const populated_users = await this.userModel
      .find({ _id: id })
      .populate('company', this.safe_slim_company_attributes);
    return _.first(populated_users).company;
  }

  async create(createUserDto: CreateUserDto) {
    const { username, password, confirmed_password, company } = createUserDto;

    const exist_user = await this.userModel.findOne({ username });
    if (exist_user) throw new UserAccountExistException();

    if (password !== confirmed_password)
      throw new AccountPasswordNotMatchConfirmException();
    const hashed_password = await bcrypt.hash(password, 10);
    const role = 'user'; // new user will be assigned `user` role by default.

    const loose_create_user = {
      ...createUserDto,
      hashed_password,
      role,
      company,
    };
    const compacted_user = pickBy(
      loose_create_user,
      (c) => c !== undefined && c !== null && c !== '',
    ) as any;
    const user = (await this.userModel.create(compacted_user)) as User;
    if (!user) throw new InternalServerErrorException();
    return this.permit(user);
  }

  async update(userShowDto: UserShowDto, updateUserDto: UpdateUserDto) {
    const currUser = await this.unsafeFindByUsername(userShowDto);
    return await this.updateAnyUser(currUser, updateUserDto);
  }

  async adminUpdate(userId: string, adminUpdateUserDto: AdminUpdateUserDto) {
    const user = await this.unsafeFindById(userId);
    return this.updateAnyUser(user, adminUpdateUserDto);
  }

  async remove(id: string) {
    await this.userModel.findByIdAndDelete(id);
  }

  async removeCompany(id: string) {
    return await this.userModel.findByIdAndUpdate(
      id,
      {
        $unset: { company: 0 } as any,
      },
      { new: true, useFindAndModify: false },
    );
  }

  async unsafeFindByUsername(userShowDto: UserShowDto) {
    const { username } = userShowDto;
    const user = await this.userModel.findOne({ username });
    if (!user) throw new NotFoundException();
    return user;
  }

  async removeCompanyFromUsers(
    id: string,
    options?: { session?: ClientSession },
  ) {
    const res = await this.userModel.updateMany(
      { company: id as any },
      { $unset: { company: 0 } as any },
      options,
    );
    console.log(res);
  }

  // --------------------- private methods -------------------------

  private async updateAnyUser(currUser: User, updateUserDto: UpdateUserDto) {
    const { id } = currUser;
    const { password, confirmed_password } = updateUserDto;
    if (password !== confirmed_password)
      throw new AccountPasswordNotMatchConfirmException();

    const user = await this.userModel.findByIdAndUpdate(
      id,
      pickBy(updateUserDto, (c) => c !== undefined && c !== null && c !== ''),
      {
        new: true,
        useFindAndModify: false,
      },
    );
    if (!user) throw new NotFoundException();
    return this.permit(user);
  }

  private async unsafeFindById(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException();
    return user;
  }
  private async permit(user: User) {
    return pick(user, this.safe_attributes);
  }
}
