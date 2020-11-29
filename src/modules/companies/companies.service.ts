import { Company } from './schemas/company.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<Company>,
  ) {}

  findById(id: string) {
    return this.companyModel.findById(id);
  }

  findAll() {
    return this.companyModel.find().exec();
  }

  create(body: any) {
    const coffee = new this.companyModel(body);
    return coffee.save();
  }
}
