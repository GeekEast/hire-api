import { CompaniesService } from 'modules/companies/companies.service';
import { CreateVacancyDto } from './dto/create.dto';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ListVacancyPaginationDto } from './dto/list.dto';
import { Model } from 'mongoose';
import { UpdateVacancyDto } from './dto/update.dto';
import { Vacancy } from './schemas/vacancy.schema';

@Injectable()
export class VacanciesService {
  constructor(
    @InjectModel(Vacancy.name) private vacancyModel: Model<Vacancy>,
    private readonly companyService: CompaniesService,
  ) {}

  async findById(id: string) {
    const vacancy = await this.vacancyModel.findById(id);
    if (!vacancy) throw new NotFoundException();
    return vacancy;
  }

  async findAll(listVacancyPaginationDto: ListVacancyPaginationDto) {
    const { limit, skip } = listVacancyPaginationDto;
    return await this.vacancyModel
      .find()
      .populate('company', ['_id', 'vacancies', 'users', 'name', 'address'])
      .limit(limit)
      .skip(skip);
  }

  async create(createVacancyDto: CreateVacancyDto) {
    const vacancy = await this.vacancyModel.create(createVacancyDto);
    const { company } = vacancy;
    await this.companyService.addVacancyToCompany({
      companyId: company as any,
      vacancy,
    });
    return vacancy;
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

    return vacancy;
  }

  async remove(id: string) {
    await this.findById(id);
    return await this.vacancyModel.findByIdAndDelete(id);
  }
}
