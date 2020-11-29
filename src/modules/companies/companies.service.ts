import { Company } from './schemas/company.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateCompanyDto } from './dto/updateCompany.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<Company>,
  ) {}

  findById(id: string) {
    return this.companyModel.findById(id);
  }

  async findAll() {
    return await this.companyModel.find();
  }

  create(body: any) {
    const coffee = new this.companyModel(body);
    return coffee.save();
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    return await this.companyModel.findOneAndUpdate(
      { _id: id },
      updateCompanyDto,
    );
  }

  async delete(id: string) {
    return await this.companyModel.findOneAndDelete({ _id: id });
  }
}
