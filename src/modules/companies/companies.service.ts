import { VacanciesSortDto } from './../vacancies/dto/sort.dto';
import { CompanySortDto } from './dto/sort.dto';
import { Company } from './schemas/company.schema';
import { CompanyExistException } from 'exceptions/custom';
import { CreateCompanyDto } from './dto/create.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isEmpty, pick } from 'lodash';
import { UpdateCompanyDto } from './dto/update.dto';
import { User } from 'modules/users/schemas/user.schema';
import { Vacancy } from 'modules/vacancies/schemas/vacancy.schema';
import { UserSortDto } from 'modules/users/dto/sort.dto';
import { Model } from 'mongoose';

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
  ) {
    this.safe_attributes = ['id', 'name', 'address', 'users', 'vacancies'];
    this.safe_slim_attributes = ['id', 'name', 'address'];
    this.safe_user_attributes = ['id', 'username', 'name', 'role'];
    this.safe_vacancy_attributes = ['id', 'title', 'description', 'expiredAt'];
  }

  async findByName(name: string) {
    const company = await this.companyModel.find({ name });
    if (isEmpty(company)) throw new NotFoundException();
    return this.permit(company);
  }

  async findById(id: string) {
    const company = await this.companyModel.findById(id);
    if (!company) throw new NotFoundException();
    return this.permit(company);
  }

  async findUsersById(
    id: string,
    showCompanyUsersDto: {
      limit?: number;
      skip?: number;
      populate?: number;
      sort?: UserSortDto;
    },
  ) {
    const { limit, skip, sort } = showCompanyUsersDto;
    const users = await this.userModel
      .find({ company: id as any })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select(this.safe_user_attributes);
    return users;
  }

  async findVacanciesById(
    id: string,
    showCompanyVacancies: {
      limit?: number;
      skip?: number;
      populate?: number;
      sort?: VacanciesSortDto;
    },
  ) {
    const { limit, skip, sort } = showCompanyVacancies;
    const vacancies = await this.vacancyModel
      .find({ company: id as any })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select(this.safe_vacancy_attributes);
    return vacancies;
  }

  async findAll(indexCompanyDto: {
    limit?: number;
    skip?: number;
    populate?: number;
    sort?: CompanySortDto;
  }) {
    const { skip, limit, sort } = indexCompanyDto;
    return await this.companyModel
      .find()
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select(this.safe_slim_attributes);
  }

  async create(createCompanyDto: CreateCompanyDto) {
    const { name } = createCompanyDto;
    const exist_company = await this.companyModel.findOne({ name });
    if (exist_company) throw new CompanyExistException();
    const company = await this.companyModel.create(createCompanyDto);
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
    const company = await this.companyModel.findByIdAndDelete(id);
    return company;
  }

  // --------------------- private methods -------------------------
  private permit(company) {
    return pick(company, this.safe_slim_attributes);
  }
}
