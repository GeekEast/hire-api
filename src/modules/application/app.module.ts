import { AppController } from 'modules/application/app.controller';
import { AppService } from 'modules/application/app.service';
import { AuthModule } from 'modules/auth/auth.module';
import { CompaniesModule } from 'modules/companies/companies.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'modules/users/users.module';
import { VacanciesModule } from 'modules/vacancies/vacancies.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://api_user:api1234@localhost:27017/api_dev_db',
      {
        useCreateIndex: true,
      },
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
