import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { saveRoutesToJson } from 'utils';
import { AppModule } from 'modules/application/app.module';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from 'exceptions/filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  // add pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip out unwanted attributes
      forbidNonWhitelisted: false, // throw an error if unwanted attributes are passed.
      transform: true, // will convert createXXXDto as instance of CreateXXXDto, good for attribute transformation from string to int or others.
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  const port = configService.get<number>('api.port');
  await app.listen(port || 3000);
  saveRoutesToJson(app);
}
bootstrap();
