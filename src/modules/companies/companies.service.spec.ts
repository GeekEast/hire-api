import { VacancySchema } from 'modules/vacancies/schemas/vacancy.schema';
import { VacanciesService } from 'modules/vacancies/vacancies.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesService } from './companies.service';
import { CompanySchema } from './schemas/company.schema';
import { UserSchema } from 'modules/users/schemas/user.schema';

describe('CompaniesService', () => {
  let service: CompaniesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VacanciesService,
        CompaniesService,
        { provide: 'CompanyModel', useValue: CompanySchema },
        { provide: 'VacancyModel', useValue: VacancySchema },
        { provide: 'UserModel', useValue: UserSchema },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
