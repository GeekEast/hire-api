import bcrypt from 'bcrypt';
import { CompaniesService } from 'modules/companies/companies.service';
import { CreateUserDto } from './dto/create.dto';
import { get } from 'lodash';
import { InjectModel } from '@nestjs/mongoose';
import { isEmpty, pick } from 'lodash';
import { ListUserPaginationDto } from './dto/list.dt';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update.dto';
import { User } from './schemas/user.schema';
import { UserShowDto } from './dto/show.dto';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async findByUsername(userShowDto: UserShowDto) {
    const { username } = userShowDto;
    const user = await this.userModel.findOne({ username });
    return user;
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException();
    return user;
  }

  async findAll(listUserPagination: ListUserPaginationDto) {
    const { limit, skip } = listUserPagination;
    return await this.userModel
      .find()
      .populate('company', ['_id', 'vacancies', 'users', 'name', 'address'])
      .limit(limit)
      .skip(skip)
      .select(['_id', 'name', 'username', 'company', 'role']);
  }

  async create(createUserDto: CreateUserDto) {
    const { username, password, confirmed_password, company } = createUserDto;
    const exist_user = await this.userModel.find({ username });
    if (!isEmpty(exist_user)) throw new UserAccountExistException();
    if (password !== confirmed_password)
      throw new AccountPasswordNotMatchConfirmException();
    const hashed_password = await bcrypt.hash(password, 10);
    const role = 'user'; // new user will be assigned `user` role by default.

    // create user
    const user = (await this.userModel.create({
      ...createUserDto,
      hashed_password,
      role,
      company,
    })) as User;

    // add user to company
    await this.companyService.addUserToCompany({
      companyId: company as any,
      user: get(user, ['_id']),
    });
    return this.safeUser(user);
  }

  async update(userShowDto: UserShowDto, updateUserDto: UpdateUserDto) {
    const currUser = await this.findByUsername(userShowDto);
    return await this.updateAnyUser(currUser, updateUserDto);
  }

  async adminUpdate(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.findById(userId);
    return this.updateAnyUser(user, updateUserDto);
  }

  async remove(id: string) {
    await this.findById(id);
    return await this.userModel.findByIdAndDelete(id);
  }

  // --------------------- private methods -------------------------

  private async safeUser(user: User) {
    return pick(user, ['_id', 'username', 'name', 'role', 'company']);
  }

  private async updateAnyUser(currUser: User, updateUserDto: UpdateUserDto) {
    const { id, company: prevCompany } = currUser;
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

    await this.companyService.removeUserFromCompany({
      companyId: prevCompany as any,
      user: user._id,
    });
    await this.companyService.addUserToCompany({
      companyId: currCompany as any,
      user: user._id,
    });

    return this.safeUser(user);
  }
}
