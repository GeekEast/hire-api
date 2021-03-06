import { CompanySchema } from 'modules/companies/schemas/company.schema';
import { CompaniesService } from 'modules/companies/companies.service';
import { VacancySchema } from './schemas/vacancy.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { VacanciesService } from './vacancies.service';
import { UserSchema } from 'modules/users/schemas/user.schema';

describe('VacanciesService', () => {
  let service: VacanciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VacanciesService,
        CompaniesService,
        { provide: 'VacancyModel', useValue: VacancySchema },
        { provide: 'CompanyModel', useValue: CompanySchema },
        { provide: 'UserModel', useValue: UserSchema },
      ],
    }).compile();

    service = module.get<VacanciesService>(VacanciesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
