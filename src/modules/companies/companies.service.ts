import { AddUserToCompanyDto } from './dto/addUser.dto';
import { AddVacancyToCompanyDto } from './dto/addVacancy.dto';
import { Company } from './schemas/company.schema';
import { CompanyExistException } from 'exceptions';
import { CreateCompanyDto } from './dto/create.dto';
import { IndexCompanyDto } from './dto/list.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { pick } from 'lodash';
import { RemoveUserFromCompanyDto } from './dto/removeUser.dto';
import { RemoveVacancyFromCompanyDto } from './dto/removeVacancy.dto';
import { UpdateCompanyDto } from './dto/update.dto';

@Injectable()
export class CompaniesService {
  safe_attributes: string[];
  constructor(@InjectModel(Company.name) private companyModel: Model<Company>) {
    this.safe_attributes = ['_id', 'name', 'address', 'users', 'vacancies'];
  }

  async findById(id: string) {
    const company = await this.companyModel.findById(id);
    if (!company) throw new NotFoundException();
    return this.permit(company);
  }

  async findAll(indexCompanyDto: IndexCompanyDto) {
    const { skip, limit } = indexCompanyDto;
    return await this.companyModel
      .find()
      .limit(limit)
      .skip(skip)
      .select(this.safe_attributes);
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
        $pull: { vacancies: vacancy },
      },
      { new: true, useFindAndModify: false },
    );
  }

  private permit(company) {
    return pick(company, this.safe_attributes);
  }
}
