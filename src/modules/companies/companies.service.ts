import { UsersService } from 'modules/users/users.service';
import { Company } from './schemas/company.schema';
import { CompanyExistException } from 'exceptions/custom';
import { CreateCompanyDto } from './dto/create.dto';
import { IndexCompanyDto } from './dto/list.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { pick } from 'lodash';
import { ShowCompanyUserDto } from './dto/users';
import { ShowCompanyVacancies } from './dto/vacancies';
import { UpdateCompanyDto } from './dto/update.dto';
import { User } from 'modules/users/schemas/user.schema';
import { Vacancy } from 'modules/vacancies/schemas/vacancy.schema';
import { VacanciesService } from 'modules/vacancies/vacancies.service';

@Injectable()
export class CompaniesService {
  safe_attributes: string[];
  safe_slim_attributes: string[];
  safe_user_attributes: string[];
  safe_vacancy_attributes: string[];
  constructor(
    @InjectModel(Company.name) private companyModel: Model<Company>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Vacancy.name) private vacancyModel: Model<Vacancy>,
    @InjectConnection() private readonly connection: Connection,
    private usersService: UsersService,
    private vacanciesService: VacanciesService,
  ) {
    this.safe_attributes = ['_id', 'name', 'address', 'users', 'vacancies'];
    this.safe_slim_attributes = ['_id', 'name', 'address'];
    this.safe_user_attributes = ['_id', 'username', 'name', 'role'];
    this.safe_vacancy_attributes = ['_id', 'title', 'description', 'expiredAt'];
  }

  async findById(id: string) {
    const company = await this.companyModel.findById(id);
    if (!company) throw new NotFoundException();
    return this.permit(company);
  }

  async findUsersById(id: string, showCompanyUsersDto: ShowCompanyUserDto) {
    const { limit, skip } = showCompanyUsersDto;
    const users = await this.userModel
      .find({ company: id as any })
      .limit(limit)
      .skip(skip)
      .select(this.safe_user_attributes);
    return users;
  }

  async findVacanciesById(
    id: string,
    showCompanyVacancies: ShowCompanyVacancies,
  ) {
    const { limit, skip } = showCompanyVacancies;
    const vacancies = await this.vacancyModel
      .find({ company: id as any })
      .limit(limit)
      .skip(skip)
      .select(this.safe_vacancy_attributes);
    return vacancies;
  }

  async findAll(indexCompanyDto: IndexCompanyDto) {
    const { skip, limit } = indexCompanyDto;
    return await this.companyModel
      .find()
      .select(this.safe_slim_attributes)
      .limit(limit)
      .skip(skip);
  }

  async create(createCompanyDto: CreateCompanyDto) {
    const { name } = createCompanyDto;
    const exist_company = await this.companyModel.findOne({ name });
    if (exist_company) throw new CompanyExistException();
    const company = await new this.companyModel(createCompanyDto).save();
    return this.permit(company);
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    await this.findById(id);
    return await this.companyModel
      .findByIdAndUpdate(id, updateCompanyDto, {
        new: true,
        useFindAndModify: false,
      })
      .select(this.safe_attributes);
  }

  async remove(id: string) {
    await this.findById(id);
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      await this.companyModel.findByIdAndDelete(id, { session });
      await this.usersService.removeCompanyFromUsers(id, { session });
      await this.vacanciesService.removeCompanyFromVacancies(id, { session });
      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }

  // --------------------- private methods -------------------------
  private permit(company) {
    return pick(company, this.safe_slim_attributes);
  }

  private async removeCompanyFromUsers(id: string) {
    const res = await this.userModel.updateMany(
      { company: id as any },
      { $unset: { company: 0 } as any },
    );
    console.log(res);
  }

  private async removeCompanyFromVacancies(id: string) {
    const res = await this.vacancyModel.updateMany(
      { company: id as any },
      { $unset: { company: 0 } as any },
    );
    console.log(res);
  }
}
