import { AddUserToCompanyDto } from './dto/addUser.dto';
import { AddVacancyToCompanyDto } from './dto/addVacancy.dto';
import { Company } from './schemas/company.schema';
import { IndexCompanyDto } from './dto/indexCompnay.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RemoveUserFromCompanyDto } from './dto/removeUser.dto';
import { UpdateCompanyDto } from './dto/updateCompany.dto';
import { RemoveVacancyFromCompanyDto } from './dto/removeVacancy.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<Company>,
  ) {}

  async findById(id: string) {
    const company = await this.companyModel.findById(id);
    if (!company) throw new NotFoundException();
    return company;
  }

  async findAll(indexCompanyDto: IndexCompanyDto) {
    const { skip, limit } = indexCompanyDto;
    return await this.companyModel.find().limit(limit).skip(skip);
  }

  async create(body: any) {
    const coffee = new this.companyModel(body);
    return await coffee.save();
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    await this.findById(id);
    return await this.companyModel.findByIdAndUpdate(id, updateCompanyDto, {
      new: true,
      useFindAndModify: false,
    });
  }

  async delete(id: string) {
    await this.findById(id);
    return await this.companyModel.findByIdAndDelete(id);
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
        $pull: { users: user },
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
}
