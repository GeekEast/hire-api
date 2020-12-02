import { UserSchema } from './schemas/user.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CompaniesService } from 'modules/companies/companies.service';
import { CompanySchema } from 'modules/companies/schemas/company.schema';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        CompaniesService,
        { provide: 'UserModel', useValue: UserSchema },
        { provide: 'CompanyModel', useValue: CompanySchema },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
