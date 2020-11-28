import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { saveRoutesToJson } from 'utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // add pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip out unwanted attributes
      forbidNonWhitelisted: true, // throw an error if unwanted attributes are passed.
      transform: true, // will convert createXXXDto as instance of CreateXXXDto, good for attribute transformation from string to int or others.
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(3000);
  saveRoutesToJson(app);
}
bootstrap();
