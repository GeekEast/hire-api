import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';

@Module({
  imports: [
    CoffeesModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'hireapi',
      database: 'hire_db',
      autoLoadEntities: true,
      // will automatically generate tables for @Entities()
      synchronize: true, // disable this for production
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
