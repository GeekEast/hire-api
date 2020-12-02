import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'modules/users/users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserSchema } from 'modules/users/schemas/user.schema';
import { CompaniesService } from 'modules/companies/companies.service';
import { CompanySchema } from 'modules/companies/schemas/company.schema';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        CompaniesService,
        JwtService,
        { provide: 'UserModel', useValue: UserSchema },
        { provide: 'CompanyModel', useValue: CompanySchema },
        { provide: 'JWT_MODULE_OPTIONS', useValue: {} },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
