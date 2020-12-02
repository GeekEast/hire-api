import { CompaniesService } from 'modules/companies/companies.service';
import { CreateVacancyDto } from './dto/create.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ListVacancyPaginationDto } from './dto/list.dto';
import { Connection, Model } from 'mongoose';
import { UpdateVacancyDto } from './dto/update.dto';
import { Vacancy } from './schemas/vacancy.schema';
import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { pick } from 'lodash';

@Injectable()
export class VacanciesService {
  safe_attributes: string[];
  constructor(
    @InjectModel(Vacancy.name) private vacancyModel: Model<Vacancy>,
    @InjectConnection() private readonly connection: Connection,
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
    const session = await this.connection.startSession();
    session.startTransaction();
    let vacancy;
    try {
      vacancy = await this.vacancyModel.create(createVacancyDto);
      const { company } = vacancy;
      await this.companyService.addVacancyToCompany({
        companyId: company as any,
        vacancy,
      });
      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
    } finally {
      session.endSession();
    }

    if (!vacancy) throw new InternalServerErrorException();
    return this.permit(vacancy);
  }

  async update(id: string, updateVacancyDto: UpdateVacancyDto) {
    const { company: prevCompany } = await this.findById(id);
    const session = await this.connection.startSession();
    session.startTransaction();
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
      const { company: currCompany } = vacancy;

      await this.companyService.removeVacancyFromCompany({
        companyId: prevCompany as any,
        vacancy: vacancy._id,
      });
      await this.companyService.addVacancyToCompany({
        companyId: currCompany as any,
        vacancy: vacancy._id,
      });
      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
    } finally {
      session.endSession;
    }
    if (!vacancy) throw new InternalServerErrorException();
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
