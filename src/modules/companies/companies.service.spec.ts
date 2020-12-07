import { NotFoundException } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { Company } from './schemas/company.schema';
import { Document, Model } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'modules/users/schemas/user.schema';
import { VacanciesService } from 'modules/vacancies/vacancies.service';
import { Vacancy } from 'modules/vacancies/schemas/vacancy.schema';

type MockModel<T extends Document> = Partial<Record<keyof Model<T>, jest.Mock>>;
const createMockModel = <T extends Document>(): MockModel<T> => ({
  find: jest.fn(),
  findById: jest.fn(),
});

describe('CompaniesService', () => {
  let service: CompaniesService;
  let companyModel: MockModel<Company>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VacanciesService,
        CompaniesService,
        { provide: 'CompanyModel', useValue: createMockModel<Company>() },
        { provide: 'VacancyModel', useValue: createMockModel<Vacancy>() },
        { provide: 'UserModel', useValue: createMockModel<User>() },
      ],
    }).compile();
    service = module.get<CompaniesService>(CompaniesService);
    companyModel = module.get<MockModel<Company>>('CompanyModel');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // findBy type test
  describe('findByName', () => {
    describe('when company with name exists', () => {
      it('shoule return the company object', async () => {
        const name = 'google';
        const expectedCompany = { name: 'google' };
        companyModel.find.mockReturnValue(expectedCompany);
        const company = await service.findByName(name);
        expect(company).toEqual(expectedCompany);
      });
    });

    describe(`when company with name doesn't exist`, () => {
      it(`should throw the "NotFoundException"`, async () => {
        const name = 'God Company';
        companyModel.find.mockReturnValue(undefined);
        try {
          await service.findByName(name);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
        }

        companyModel.find.mockReturnValue(null);
        try {
          await service.findByName(name);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
        }

        companyModel.find.mockReturnValue({});
        try {
          await service.findByName(name);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
        }

        companyModel.find.mockReturnValue([]);
        try {
          await service.findByName(name);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
        }
      });
    });
  });

  // TODO: this one need intergration testing
  // describe('findAll', () => {
  //   describe('when no query parameters are passed', () => {});
  // });

  // // create type unit test
  // describe('create', () => {});
  // // update type unit test

  // describe('update', () => {});
  // // remove type unit test

  // describe('remove', () => {});
  // // private method unit test
  // describe('permit', () => {
  //   it('test', () => {
  //     Object.getPrototypeOf(service).permit;
  //   });
  // });
});
