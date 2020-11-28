import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { AppController } from 'app.controller';
import { AppService } from 'app.service';
import { CompaniesModule } from 'companies/companies.module';
import { UsersModule } from 'users/users.module';
import { VacanciesModule } from 'vacancies/vacancies.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://api_user:api1234@localhost:27017/api_dev_db',
    ),
    CompaniesModule,
    UsersModule,
    VacanciesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
