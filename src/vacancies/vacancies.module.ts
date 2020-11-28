import { Module } from '@nestjs/common';
import { VacanciesService } from './vacancies.service';
import { VacanciesController } from './vacancies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Vacancy, VacancySchema } from './schemas/vacancy.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Vacancy.name, schema: VacancySchema }]),
  ],
  providers: [VacanciesService],
  controllers: [VacanciesController],
})
export class VacanciesModule {}
