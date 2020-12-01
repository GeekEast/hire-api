import appConfigs from './configs';
import { AppController } from 'modules/application/app.controller';
import { AppService } from 'modules/application/app.service';
import { AuthModule } from 'modules/auth/auth.module';
import { CompaniesModule } from 'modules/companies/companies.module';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'modules/users/users.module';
import { VacanciesModule } from 'modules/vacancies/vacancies.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfigs],
      isGlobal: true,
      envFilePath: ['.development.env'],
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DBNAME}`,
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
