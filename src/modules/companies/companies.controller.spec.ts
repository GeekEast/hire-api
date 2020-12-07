import { UserSchema } from './../users/schemas/user.schema';
import { CompaniesService } from 'modules/companies/companies.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesController } from './companies.controller';
import { CompanySchema } from './schemas/company.schema';
import { VacancySchema } from 'modules/vacancies/schemas/vacancy.schema';

describe('CompaniesController', () => {
  let controller: CompaniesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [CompaniesController],
      providers: [
        CompaniesService,
        { provide: 'CompanyModel', useValue: CompanySchema },
        { provide: 'UserModel', useValue: UserSchema },
        { provide: 'VacancyModel', useValue: VacancySchema },
      ],
    }).compile();

    controller = module.get<CompaniesController>(CompaniesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
