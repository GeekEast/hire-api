import { CompaniesService } from 'modules/companies/companies.service';
import { Company } from 'modules/companies/schemas/company.schema';
import { CompanySchema } from 'modules/companies/schemas/company.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Company.name, schema: CompanySchema },
    ]),
  ],
  providers: [UsersService, CompaniesService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
