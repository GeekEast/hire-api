import { VacanciesSortDto } from './dto/sort.dto';
import { ClientSession, Model } from 'mongoose';
import { CreateVacancyDto } from './dto/create.dto';
import { InjectModel } from '@nestjs/mongoose';
import { isEmpty, pick, pickBy } from 'lodash';
import { ListVacancyPaginationDto } from './dto/list.dto';
import { UpdateVacancyDto } from './dto/update.dto';
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
      '_id',
      'title',
      'description',
      'expiredAt',
      'company',
    ];
    this.safe_slim_company_attributes = ['_id', 'name', 'address'];
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

  async create(createVacancyDto: CreateVacancyDto) {
    const compact_createVacancyDto = pickBy(
      createVacancyDto,
      (c) => !isEmpty(c),
    ) as any;
    const vacancy = await this.vacancyModel.create(compact_createVacancyDto);
    if (!vacancy) throw new InternalServerErrorException();
    return this.permit(vacancy);
  }

  async update(id: string, updateVacancyDto: UpdateVacancyDto) {
    const vacancy = await this.vacancyModel.findByIdAndUpdate(
      id,
      pickBy(updateVacancyDto, (c) => !isEmpty(c)),
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

  async removeCompanyFromVacancies(
    id: string,
    options?: { session?: ClientSession },
  ) {
    const res = await this.vacancyModel.updateMany(
      { company: id as any },
      { $unset: { company: 0 } as any },
      options,
    );
    console.log(res);
  }

  // --------------------- private methods -------------------------

  private async permit(vacancy: Vacancy) {
    return pick(vacancy, this.safe_attributes);
  }
}
