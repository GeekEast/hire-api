import { CompaniesService } from 'modules/companies/companies.service';
import { UsersService } from 'modules/users/users.service';
import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { UserSchema } from 'modules/users/schemas/user.schema';
import { CompanySchema } from 'modules/companies/schemas/company.schema';
import { VacancySchema } from 'modules/vacancies/schemas/vacancy.schema';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UsersService,
        CompaniesService,
        JwtService,
        { provide: 'UserModel', useValue: UserSchema },
        { provide: 'CompanyModel', useValue: CompanySchema },
        { provide: 'JWT_MODULE_OPTIONS', useValue: {} },
        { provide: 'VacancyModel', useValue: VacancySchema },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
