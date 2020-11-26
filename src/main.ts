import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { saveRoutesToJson } from 'utils';

async function bootstrap() {
  // register with the root module
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  saveRoutesToJson(app);
}

bootstrap();
