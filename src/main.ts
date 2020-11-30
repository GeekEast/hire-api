import { AppModule } from 'modules/application/app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { saveRoutesToJson } from 'utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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

  await app.listen(3000);
  saveRoutesToJson(app);
}
bootstrap();
