import appConfigs from './configs';
import { AppController } from 'modules/application/app.controller';
import { AppService } from 'modules/application/app.service';
import { AuthModule } from 'modules/auth/auth.module';
import { CompaniesModule } from 'modules/companies/companies.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'modules/users/users.module';
import { VacanciesModule } from 'modules/vacancies/vacancies.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfigs],
      isGlobal: true,
      envFilePath: ['.local.development.env'],
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const username = configService.get<string>('mongodb.username');
        const password = configService.get<string>('mongodb.password');
        const host = configService.get<string>('mongodb.host');
        const port = configService.get<string>('mongodb.port');
        const dbname = configService.get<string>('mongodb.name');
        const uri = `mongodb://${username}:${password}@${host}:${port}/${dbname}`;
        return {
          uri,
          useCreateIndex: true,
        };
      },
      inject: [ConfigService],
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
