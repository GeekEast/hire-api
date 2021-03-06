import _ from 'lodash';
import { CreateVacancyDto } from './dto/create.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { pick, pickBy } from 'lodash';
import { UpdateVacancyDto } from './dto/update.dto';
import { VacanciesSortDto } from './dto/sort.dto';
import { Vacancy } from './schemas/vacancy.schema';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class VacanciesService {
  safe_attributes: string[];
  safe_slim_company_attributes: string[];
  constructor(@InjectModel(Vacancy.name) private vacancyModel: Model<Vacancy>) {
    this.safe_attributes = [
      'id',
      'title',
      'description',
      'expiredAt',
      'company',
    ];
    this.safe_slim_company_attributes = ['id', 'name', 'address'];
  }

  async findById(id: string) {
    const vacancy = await this.vacancyModel.findById(id);
    if (!vacancy) throw new NotFoundException();
    return this.permit(vacancy);
  }

  async findAll(listVacancyPaginationDto: {
    limit?: number;
    skip?: number;
    populate?: number;
    sort?: VacanciesSortDto;
  }) {
    const { limit, skip, populate, sort } = listVacancyPaginationDto;
    return await this.vacancyModel
      .find()
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .populate(
        !!populate ? 'company' : 'dto',
        this.safe_slim_company_attributes,
      )
      .select(this.safe_attributes);
  }

  async findCompany(id: string) {
    const populated_vacancies = await this.vacancyModel
      .find({ _id: id })
      .populate('company', this.safe_slim_company_attributes);
    return _.first(populated_vacancies).company;
  }
  async create(createVacancyDto: CreateVacancyDto) {
    const compact_createVacancyDto = pickBy(
      createVacancyDto,
      (c) => c !== undefined && c !== null && c !== '',
    ) as any;
    const vacancy = await this.vacancyModel.create(compact_createVacancyDto);
    if (!vacancy) throw new InternalServerErrorException();
    return this.permit(vacancy);
  }

  async update(id: string, updateVacancyDto: UpdateVacancyDto) {
    const vacancy = await this.vacancyModel.findByIdAndUpdate(
      id,
      pickBy(
        updateVacancyDto,
        (c) => c !== undefined && c !== null && c !== '',
      ),
      {
        new: true,
        useFindAndModify: false,
      },
    );
    if (!vacancy) throw new InternalServerErrorException();
    return this.permit(vacancy);
  }

  async remove(id: string) {
    await this.vacancyModel.findByIdAndDelete(id);
  }

  async removeCompany(id: string) {
    return await this.vacancyModel.findByIdAndUpdate(
      id,
      {
        $unset: { company: 0 } as any,
      },
      { new: true, useFindAndModify: false },
    );
  }

  // --------------------- private methods -------------------------

  private async permit(vacancy: Vacancy) {
    return pick(vacancy, this.safe_attributes);
  }
}
