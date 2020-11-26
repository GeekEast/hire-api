import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import fs from 'fs';
import listEndpoints from 'express-list-endpoints';

async function bootstrap() {
  // register with the root module
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  const server = app.getHttpServer();
  const router = server._events.request._router;
  fs.writeFile('routes.json', JSON.stringify(listEndpoints(router)), (err) => {
    console.log(err);
  });
}

bootstrap();
