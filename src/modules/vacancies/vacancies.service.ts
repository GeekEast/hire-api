import { InvalidObjectIdException } from '../../exceptions/custom';
import { CompaniesService } from 'modules/companies/companies.service';
import { Connection, Model } from 'mongoose';
import { CreateVacancyDto } from './dto/create.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
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
  safe_company_attributes: string[];
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
    this.safe_company_attributes = [
      '_id',
      'vacancies',
      'users',
      'name',
      'address',
    ];
  }

  async findById(id: string) {
    let vacancy;
    try {
      vacancy = await this.vacancyModel.findById(id);
    } catch (err) {
      throw new InvalidObjectIdException();
    }
    if (!vacancy) throw new NotFoundException();
    return this.permit(vacancy);
  }

  async findAll(listVacancyPaginationDto: ListVacancyPaginationDto) {
    const { limit, skip, populate } = listVacancyPaginationDto;
    return await this.vacancyModel
      .find()
      .populate(!!populate ? 'company' : 'dto', this.safe_company_attributes)
      .limit(limit)
      .skip(skip)
      .select(this.safe_attributes);
  }

  async create(createVacancyDto: CreateVacancyDto) {
    const session = await this.connection.startSession();
    session.startTransaction();

    let vacancy;
    try {
      const compact_createVacancyDto = pickBy(
        createVacancyDto,
        (c) => !isEmpty(c),
      ) as any;
      vacancy = await this.vacancyModel.create(compact_createVacancyDto);
      const { company } = vacancy;

      !!company && // if user inputs company as ""
        (await this.companyService.addVacancyToCompany({
          companyId: company as any,
          vacancy,
        }));
      await session.commitTransaction();
    } catch (err) {
      // log err into New Relic in production
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
    if (!vacancy) throw new InternalServerErrorException();
    return this.permit(vacancy);
  }

  async update(id: string, updateVacancyDto: UpdateVacancyDto) {
    const { company: prevCompany } = await this.findById(id);
    const { company: currCompany } = updateVacancyDto;
    const session = await this.connection.startSession();
    session.startTransaction();

    let vacancy;
    try {
      vacancy = await this.vacancyModel.findByIdAndUpdate(
        id,
        pickBy(updateVacancyDto, (c) => !isEmpty(c)),
        {
          new: true,
          useFindAndModify: false,
        },
      );
      // remove compnay if currCompany is ""
      if (String(currCompany) === '') {
        vacancy = await this.vacancyModel.findByIdAndUpdate(
          id,
          {
            $unset: { company: 0 } as any,
          },
          {
            new: true,
            useFindAndModify: false,
          },
        );
      }
      !!prevCompany && // if vacancy doesn't belong to one company before
        (await this.companyService.removeVacancyFromCompany({
          companyId: prevCompany as any,
          vacancy: vacancy._id,
        }));

      !!currCompany && // if vacancy doesn't belong to one company now
        (await this.companyService.addVacancyToCompany({
          companyId: currCompany as any,
          vacancy: vacancy._id,
        }));
      await session.commitTransaction();
    } catch (err) {
      // log into New Relic in Production
      await session.abortTransaction();
    } finally {
      session.endSession;
    }

    if (!vacancy) throw new InternalServerErrorException();
    return this.permit(vacancy);
  }

  async remove(id: string) {
    const { company } = await this.findById(id);
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      await this.vacancyModel.findByIdAndDelete(id);
      !!company &&
        (await this.companyService.removeVacancyFromCompany({
          companyId: String(company),
          vacancy: id,
        }));
      await session.commitTransaction();
    } catch (err) {
      // log into New Relic in Production
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  }

  // --------------------- private methods -------------------------

  private async permit(vacancy: Vacancy) {
    return pick(vacancy, this.safe_attributes);
  }
}
