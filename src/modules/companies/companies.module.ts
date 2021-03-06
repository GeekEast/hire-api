import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { Company, CompanySchema } from './schemas/company.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'modules/users/schemas/user.schema';
import {
  Vacancy,
  VacancySchema,
} from 'modules/vacancies/schemas/vacancy.schema';
import { UsersService } from 'modules/users/users.service';
import { VacanciesService } from 'modules/vacancies/vacancies.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Company.name, schema: CompanySchema },
      { name: User.name, schema: UserSchema },
      { name: Vacancy.name, schema: VacancySchema },
    ]),
  ],
  providers: [CompaniesService, UsersService, VacanciesService],
  controllers: [CompaniesController],
  exports: [CompaniesService],
})
export class CompaniesModule {}
