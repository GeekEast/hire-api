import { AddUserToCompanyDto } from './dto/addUser.dto';
import { AddVacancyToCompanyDto } from './dto/addVacancy.dto';
import { Company } from './schemas/company.schema';
import { CompanyExistException, InvalidObjectIdException } from 'exceptions/custom';
import { CreateCompanyDto } from './dto/create.dto';
import { IndexCompanyDto } from './dto/list.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { pick } from 'lodash';
import { RemoveUserFromCompanyDto } from './dto/removeUser.dto';
import { RemoveVacancyFromCompanyDto } from './dto/removeVacancy.dto';
import { ShowCompanyUserDto } from './dto/showUsers.dto';
import { ShowCompanyVacancies } from './dto/showVacancies.dto';
import { UpdateCompanyDto } from './dto/update.dto';
import { User } from './../users/schemas/user.schema';
import { Vacancy } from 'modules/vacancies/schemas/vacancy.schema';
import { Injectable, NotFoundException } from '@nestjs/common';

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
    this.safe_attributes = ['_id', 'name', 'address', 'users', 'vacancies'];
    this.safe_slim_attributes = ['_id', 'name', 'address'];
    this.safe_user_attributes = ['_id', 'username', 'name', 'role'];
    this.safe_vacancy_attributes = ['_id', 'title', 'description', 'expiredAt'];
  }

  async findById(id: string) {
    let company;
    try {
      company = await this.companyModel.findById(id);
    } catch (err) {
      throw new InvalidObjectIdException();
    }
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
    await this.companyModel.findByIdAndDelete(id);
    await this.removeCompanyFromUsers(id);
    await this.removeCompanyFromVacancies(id);
  }

  async addUserToCompany(addUserToCompanyDto: AddUserToCompanyDto) {
    const { companyId, user } = addUserToCompanyDto;
    if (!companyId || !user) return;
    return await this.companyModel.findByIdAndUpdate(
      companyId,
      {
        $addToSet: { users: user },
      },
      { new: true, useFindAndModify: false },
    );
  }

  async removeUserFromCompany(
    removeUserFromCompanyDto: RemoveUserFromCompanyDto,
  ) {
    const { companyId, user } = removeUserFromCompanyDto;
    if (!companyId || !user) return;
    return await this.companyModel.findByIdAndUpdate(
      companyId,
      {
        $pull: { users: user as any },
      },
      { new: true, useFindAndModify: false },
    );
  }

  async addVacancyToCompany(addVacancyToCompanyDto: AddVacancyToCompanyDto) {
    const { companyId, vacancy } = addVacancyToCompanyDto;
    if (!companyId || !vacancy) return;
    return await this.companyModel.findByIdAndUpdate(
      companyId,
      {
        $addToSet: { vacancies: vacancy },
      },
      { new: true, useFindAndModify: false },
    );
  }

  async removeVacancyFromCompany(
    removeVacancyFromCompanyDto: RemoveVacancyFromCompanyDto,
  ) {
    const { companyId, vacancy } = removeVacancyFromCompanyDto;
    if (!companyId || !vacancy) return;
    return await this.companyModel.findByIdAndUpdate(
      companyId,
      {
        $pull: { vacancies: vacancy as any },
      },
      { new: true, useFindAndModify: false },
    );
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
