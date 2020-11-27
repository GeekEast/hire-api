import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { saveRoutesToJson } from 'utils';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // register with the root module
  const app = await NestFactory.create(AppModule);

  // add pipes
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
  saveRoutesToJson(app);
}

bootstrap();
