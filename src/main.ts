import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { saveRoutesToJson } from 'utils';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // register with the root module
  const app = await NestFactory.create(AppModule);

  // add pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip out unwanted attributes
      forbidNonWhitelisted: true, // throw an error if unwanted attributes are passed.
      transform: true, // will convert createXXXDto as instance of CreateXXXDto, good for attribute transformation from string to int or others.
    }),
  );

  await app.listen(3000);
  saveRoutesToJson(app);
}

bootstrap();
