import { INestApplication } from '@nestjs/common';
import fs from 'fs';
import listEndpoints from 'express-list-endpoints';
import dns from 'dns';
export const saveRoutesToJson = (app: INestApplication) => {
  const server = app.getHttpServer();
  const router = server._events.request._router;
  fs.writeFile('routes.json', JSON.stringify(listEndpoints(router)), (err) => {
    !!err && console.warn(err.message);
  });
};

// TODO: doesn't work, need to know when dependency injection happens.
export async function resolveHost(host: string): Promise<string> {
  if (host !== 'host.docker.internal') process.env.RESOLVED_MONGODB_HOST = host;
  return new Promise<string>((resolve) => {
    dns.lookup(host, (err, ip) => {
      if (err) resolve(host);
      resolve(ip);
    });
  }).then((ip) => (process.env.RESOLVED_MONGODB_HOST = ip));
}
