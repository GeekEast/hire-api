import { CompanySchema } from 'modules/companies/schemas/company.schema';
import { CompaniesService } from 'modules/companies/companies.service';
import { VacancySchema } from './schemas/vacancy.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { VacanciesService } from './vacancies.service';

describe('VacanciesService', () => {
  let service: VacanciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VacanciesService,
        CompaniesService,
        { provide: 'VacancyModel', useValue: VacancySchema },
        { provide: 'CompanyModel', useValue: CompanySchema },
      ],
    }).compile();

    service = module.get<VacanciesService>(VacanciesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
