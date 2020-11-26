import { INestApplication } from '@nestjs/common';
import fs from 'fs';
import listEndpoints from 'express-list-endpoints';

export const saveRoutesToJson = (app: INestApplication) => {
  const server = app.getHttpServer();
  const router = server._events.request._router;
  fs.writeFile('routes.json', JSON.stringify(listEndpoints(router)), (err) => {
    !!err && console.warn(err.message);
  });
};
