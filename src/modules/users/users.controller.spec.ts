import { UsersService } from 'modules/users/users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UserSchema } from './schemas/user.schema';
import { CompanySchema } from 'modules/companies/schemas/company.schema';
import { CompaniesService } from 'modules/companies/companies.service';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        CompaniesService,
        { provide: 'UserModel', useValue: UserSchema },
        { provide: 'CompanyModel', useValue: CompanySchema },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
