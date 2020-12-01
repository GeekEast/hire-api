import { CompaniesService } from 'modules/companies/companies.service';
import { CreateVacancyDto } from './dto/create.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ListVacancyPaginationDto } from './dto/list.dto';
import { Model } from 'mongoose';
import { UpdateVacancyDto } from './dto/update.dto';
import { Vacancy } from './schemas/vacancy.schema';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { pick } from 'lodash';

@Injectable()
export class VacanciesService {
  safe_attributes: string[];
  constructor(
    @InjectModel(Vacancy.name) private vacancyModel: Model<Vacancy>,
    private readonly companyService: CompaniesService,
  ) {
    this.safe_attributes = [
      '_id',
      'title',
      'description',
      'expiredAt',
      'company',
    ];
  }

  async findById(id: string) {
    const vacancy = await this.vacancyModel.findById(id);
    if (!vacancy) throw new NotFoundException();
    return this.permit(vacancy);
  }

  async findAll(listVacancyPaginationDto: ListVacancyPaginationDto) {
    const { limit, skip } = listVacancyPaginationDto;
    return await this.vacancyModel
      .find()
      .populate('company', ['_id', 'vacancies', 'users', 'name', 'address'])
      .limit(limit)
      .skip(skip)
      .select(this.safe_attributes);
  }

  async create(createVacancyDto: CreateVacancyDto) {
    const vacancy = await this.vacancyModel.create(createVacancyDto);
    const { company } = vacancy;
    await this.companyService.addVacancyToCompany({
      companyId: company as any,
      vacancy,
    });
    return this.permit(vacancy);
  }

  async update(id: string, updateVacancyDto: UpdateVacancyDto) {
    const { company: prevCompany } = await this.findById(id);
    let vacancy;
    try {
      vacancy = await this.vacancyModel.findByIdAndUpdate(
        id,
        updateVacancyDto,
        {
          new: true,
          useFindAndModify: false,
        },
      );
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.FORBIDDEN);
    }
    const { company: currCompany } = vacancy;

    await this.companyService.removeVacancyFromCompany({
      companyId: prevCompany as any,
      vacancy: vacancy._id,
    });
    await this.companyService.addVacancyToCompany({
      companyId: currCompany as any,
      vacancy: vacancy._id,
    });

    return this.permit(vacancy);
  }

  async remove(id: string) {
    await this.findById(id);
    await this.vacancyModel.findByIdAndDelete(id);
  }

  private async permit(vacancy: Vacancy) {
    return pick(vacancy, this.safe_attributes);
  }
}
