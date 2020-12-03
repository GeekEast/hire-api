import { CompaniesService } from 'modules/companies/companies.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VacanciesController } from './vacancies.controller';
import { VacanciesService } from './vacancies.service';
import { Vacancy, VacancySchema } from './schemas/vacancy.schema';
import {
  Company,
  CompanySchema,
} from 'modules/companies/schemas/company.schema';
import { User, UserSchema } from 'modules/users/schemas/user.schema';
import { UsersService } from 'modules/users/users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Vacancy.name, schema: VacancySchema },
      { name: Company.name, schema: CompanySchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [VacanciesService, CompaniesService, UsersService],
  controllers: [VacanciesController],
})
export class VacanciesModule {}
