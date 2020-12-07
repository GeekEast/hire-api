import { CompaniesService } from 'modules/companies/companies.service';
import { VacanciesService } from 'modules/vacancies/vacancies.service';
import { Test, TestingModule } from '@nestjs/testing';
import { VacanciesController } from './vacancies.controller';
import { VacancySchema } from './schemas/vacancy.schema';
import { CompanySchema } from 'modules/companies/schemas/company.schema';
import { UserSchema } from 'modules/users/schemas/user.schema';

describe('VacanciesController', () => {
  let controller: VacanciesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VacanciesController],
      providers: [
        VacanciesService,
        CompaniesService,
        { provide: 'VacancyModel', useValue: VacancySchema },
        { provide: 'CompanyModel', useValue: CompanySchema },
        { provide: 'UserModel', useValue: UserSchema },
      ],
    }).compile();

    controller = module.get<VacanciesController>(VacanciesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
