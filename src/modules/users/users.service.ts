import bcrypt from 'bcrypt';
import { CompaniesService } from 'modules/companies/companies.service';
import { Connection, Model } from 'mongoose';
import { CreateUserDto } from './dto/create.dto';
import { get, isEmpty, pick, pickBy } from 'lodash';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ListUserPaginationDto } from './dto/list.dt';
import { UpdateUserDto } from './dto/update.dto';
import { User } from './schemas/user.schema';
import { UserShowDto } from './dto/show.dto';

import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  AccountPasswordNotMatchConfirmException,
  UserAccountExistException,
} from 'exceptions';

@Injectable()
export class UsersService {
  safe_attributes: string[];
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectConnection() private readonly connection: Connection,
    private readonly companyService: CompaniesService,
  ) {
    this.safe_attributes = ['_id', 'username', 'name', 'role', 'company'];
  }

  async findByUsername(userShowDto: UserShowDto) {
    const user = await this.unsafeFindByUsername(userShowDto);
    return this.permit(user);
  }

  async findById(id: string) {
    const user = await this.unsafeFindById(id);
    return this.permit(user);
  }

  async findAll(listUserPagination: ListUserPaginationDto) {
    const { limit, skip } = listUserPagination;
    return await this.userModel
      .find()
      // .populate('company', ['_id', 'vacancies', 'users', 'name', 'address'])
      .limit(limit)
      .skip(skip)
      .select(this.safe_attributes);
  }

  async create(createUserDto: CreateUserDto) {
    const { username, password, confirmed_password, company } = createUserDto;

    const exist_user = await this.userModel.findOne({ username });
    if (exist_user) throw new UserAccountExistException();

    if (password !== confirmed_password)
      throw new AccountPasswordNotMatchConfirmException();
    const hashed_password = await bcrypt.hash(password, 10);
    const role = 'user'; // new user will be assigned `user` role by default.

    const session = await this.connection.startSession();
    session.startTransaction();

    let user;
    try {
      const loose_create_user = {
        ...createUserDto,
        hashed_password,
        role,
        company,
      };
      const compacted_user = pickBy(
        loose_create_user,
        (c) => !isEmpty(c),
      ) as any;

      // create user
      user = (await this.userModel.create(compacted_user)) as User;

      // add user to company
      !!company && // if user input company as ""
        (await this.companyService.addUserToCompany({
          companyId: company as any,
          user: get(user, ['_id']),
        }));
      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
    if (!user) throw new InternalServerErrorException();
    return this.permit(user);
  }

  async update(userShowDto: UserShowDto, updateUserDto: UpdateUserDto) {
    const currUser = await this.unsafeFindByUsername(userShowDto);
    return await this.updateAnyUser(currUser, updateUserDto);
  }

  async adminUpdate(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.unsafeFindById(userId);
    return this.updateAnyUser(user, updateUserDto);
  }

  async remove(id: string) {
    await this.findById(id);
    await this.userModel.findByIdAndDelete(id);
  }

  // --------------------- private methods -------------------------

  private async updateAnyUser(currUser: User, updateUserDto: UpdateUserDto) {
    const { id, company: prevCompany } = currUser;
    const {
      password,
      confirmed_password,
      company: currCompany,
    } = updateUserDto;
    if (password !== confirmed_password)
      throw new AccountPasswordNotMatchConfirmException();

    const session = await this.connection.startSession();
    session.startTransaction();

    let user;
    try {
      // skip if company is ""
      user = await this.userModel.findByIdAndUpdate(
        id,
        {
          $set: pickBy(updateUserDto, (c) => !isEmpty(c)) as any,
        },
        {
          new: true,
          useFindAndModify: false,
        },
      );

      // remove company
      if (String(currCompany) === '') {
        user = await this.userModel.findByIdAndUpdate(
          id,
          {
            $unset: { company: 0 } as any,
          },
          {
            new: true,
            useFindAndModify: false,
          },
        );
      }
      !!prevCompany && // if user doesnt' belong to one company before
        (await this.companyService.removeUserFromCompany({
          companyId: prevCompany as any,
          user: user._id,
        }));
      !!currCompany && // if user doesn't belong to one company now
        (await this.companyService.addUserToCompany({
          companyId: currCompany as any,
          user: user._id,
        }));
      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
    if (!user) throw new InternalServerErrorException();
    return this.permit(user);
  }

  async unsafeFindByUsername(userShowDto: UserShowDto) {
    const { username } = userShowDto;
    const user = await this.userModel.findOne({ username });
    if (!user) throw new NotFoundException();
    return user;
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
