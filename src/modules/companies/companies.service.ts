import { IndexCompanyDto } from './dto/indexCompnay.dto';
import { Company } from './schemas/company.schema';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateCompanyDto } from './dto/updateCompany.dto';
import { AddUserToCompanyDto } from './dto/addUser.dto';
import { RemoveUserFromCompanyDto } from './dto/removeUser.dto';

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
    const { companyId, userId } = removeUserFromCompanyDto;
    if (!companyId || !userId) return;
    return await this.companyModel.findByIdAndUpdate(
      companyId,
      {
        $pull: { users: userId },
      },
      { new: true, useFindAndModify: false },
    );
  }
}
