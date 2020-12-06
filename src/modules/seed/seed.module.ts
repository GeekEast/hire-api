import { CompaniesModule } from './../companies/companies.module';
import { UsersModule } from './../users/users.module';
import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { CommandModule } from 'nestjs-command';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Company,
  CompanySchema,
} from 'modules/companies/schemas/company.schema';
import { User, UserSchema } from 'modules/users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Company.name, schema: CompanySchema },
      { name: User.name, schema: UserSchema },
    ]),
    UsersModule,
    CompaniesModule,
    CommandModule,
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
