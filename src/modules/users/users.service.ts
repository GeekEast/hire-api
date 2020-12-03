import bcrypt from 'bcrypt';
import { CompaniesService } from 'modules/companies/companies.service';
import { Connection, Model } from 'mongoose';
import { CreateUserDto } from './dto/create.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { isEmpty, pick, pickBy } from 'lodash';
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
  InvalidObjectIdException,
  UserAccountExistException,
} from 'exceptions/custom';

@Injectable()
export class UsersService {
  safe_attributes: string[];
  safe_slim_company_attributes: string[];
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectConnection() private connection: Connection,
    private companyService: CompaniesService,
  ) {
    this.safe_attributes = ['_id', 'username', 'name', 'role', 'company'];
    this.safe_slim_company_attributes = ['_id', 'name', 'address'];
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
    const { limit, skip, populate } = listUserPagination;
    return await this.userModel
      .find()
      .populate(
        !!populate ? 'company' : 'dto',
        this.safe_slim_company_attributes,
      )
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
      user = (await this.userModel.create(compacted_user)) as User;
    } catch (err) {
      throw new InvalidObjectIdException();
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
    try {
      await this.userModel.findByIdAndDelete(id);
    } catch (err) {
      throw new InvalidObjectIdException();
    }
  }

  async removeCompany(id: string) {
    try {
      return await this.userModel.findByIdAndUpdate(
        id,
        {
          $unset: { company: 0 } as any,
        },
        { new: true, useFindAndModify: false },
      );
    } catch (err) {
      throw new InvalidObjectIdException();
    }
  }

  async unsafeFindByUsername(userShowDto: UserShowDto) {
    const { username } = userShowDto;
    const user = await this.userModel.findOne({ username });
    if (!user) throw new NotFoundException();
    return user;
  }

  // --------------------- private methods -------------------------

  private async updateAnyUser(currUser: User, updateUserDto: UpdateUserDto) {
    const { id } = currUser;
    const {
      password,
      confirmed_password,
      company: currCompany,
    } = updateUserDto;
    if (password !== confirmed_password)
      throw new AccountPasswordNotMatchConfirmException();

    let user;
    try {
      // step 1: normal update, Internal Error might happen
      user = await this.userModel.findByIdAndUpdate(
        id,
        pickBy(updateUserDto, (c) => !isEmpty(c)),
        {
          new: true,
          useFindAndModify: false,
        },
      );
    } catch (err) {
      throw new InvalidObjectIdException();
    }
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
