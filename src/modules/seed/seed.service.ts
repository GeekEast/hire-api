import { CompaniesService } from 'modules/companies/companies.service';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'modules/users/users.service';

@Injectable()
export class SeedService {
  constructor(
    private readonly usersService: UsersService,
    private readonly companiesService: CompaniesService,
  ) {}

  async seed() {
    const company_id = await this.seedCompany();
    await this.seedUsers(company_id);
  }

  async seedCompany() {
    let company;
    try {
      company = this.companiesService.findByName('PredictiveHire');
    } catch (err) {
      console.log('not found');
    }
    if (!company) {
      const { id } = await this.companiesService.create({
        name: 'PredictiveHire',
        address: '15 Newton St',
      });
      return id;
    }
    return company.id;
  }

  async seedUsers(company: any) {
    try {
      await this.usersService.findByUsername({ username: 'bob' });
    } catch (err) {
      await this.usersService.create({
        name: 'Bob Markle',
        username: 'bob',
        password: 'bob',
        confirmed_password: 'bob',
        company,
      });
    }

    let user2;
    try {
      user2 = await this.usersService.findByUsername({ username: 'mark' });
    } catch (err) {
      user2 = await this.usersService.create({
        name: 'Mark Smith',
        username: 'mark',
        password: 'mark',
        confirmed_password: 'mark',
        company,
      });
    } finally {
      return await this.usersService.adminUpdate(user2.id, {
        role: 'admin',
      });
    }
  }
}
