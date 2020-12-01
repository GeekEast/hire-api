import { AppController } from 'modules/application/app.controller';
import { AppService } from 'modules/application/app.service';
import { AuthModule } from 'modules/auth/auth.module';
import { CompaniesModule } from 'modules/companies/companies.module';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'modules/users/users.module';
import { VacanciesModule } from 'modules/vacancies/vacancies.module';
import appConfigs from './configs';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfigs],
      isGlobal: true,
      envFilePath: ['.development.env'],
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      useCreateIndex: true,
    }),
    CompaniesModule,
    UsersModule,
    VacanciesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
