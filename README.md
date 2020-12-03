<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

### Theory


### Config
- You need `.local.development.env` to include all the environment variables for development on you local computer.
```sh
# MongDB
MONGODB_USERNAME=
MONGODB_PASSWORD=
MONGODB_DBNAME=
MONGODB_HOST=localhost
MONGODB_PORT=27017
# JWT
JWT_SECRET=
JWT_EXPIRE=1d
# NESTJS
API_PORT=
```
- You need `.docker.development.env` to include all the environment variables for development on docker-compose mode.
```sh
# Docker
MODE=docker # necessary for resolve host IP in start.docker.sh
# MongDB
MONGODB_USERNAME= # same in docker-entrypoint-initdb.d/mongo-init.js
MONGODB_PASSWORD= # same in docker-entrypoint-initdb.d/mongo-init.js
MONGODB_DBNAME= # same in docker-entrypoint-initdb.d/mongo-init.js
# MONGODB_HOST don't set this field, because it will be handled by start.docker.sh
MONGODB_PORT=27017
# JWT
JWT_SECRET=
JWT_EXPIRE=1d
# NEST
API_PORT=3000 # same to container's published port in docker-compose.yml
```
- You need `docker-entrypoint-initdb.d` to init your dockerized mongodb.
```javascript
// docker-entrypoint-initdb.d/mongo-init.js
const db = 'dbname';
const user = 'username';
const pwd = 'password';

db = db.getSiblingDB(db);
db.createUser({
  user,
  pwd,
  roles: [{ role: 'readWrite', db }],
});
```
- Please make sure your local `API_PORT` is not used by other program.
- develop locally `yarn start:dev`
- develop in docker `docker-compose up -d`


### Modeling in a Mongo Way
- No-SQL Cascading Problem when you want to scale the application?
  - keep foreign in only one side or the join table
- Unbounded Array Problem (MongDB Modeling)
  - Don't store array.
- Circulr Dependency (nestjs)
  - Answer is same like the firstone;
### Insights
- Should develop `GraphQL` first, then `API` and then `MongoDB`. (**Mongo way**)
- Grapql should be responsible for `assembling` data from API **dumb** endpoints.
- `docker-compose.yml` env vars injection happens in after `docker run`, not when `docker build`.
### Tasks
- Error Logging Service: New Relic for Production.
- Docker network bridge to solve the `host.docker.internal` problem.
- Robost sort parameter parser in Nestjs.
- Read advanced mongo modeling pattern.
- Unit Testing
  - Keep unit testing separate from each module.
  - Try to  **mock** 3rd party `providers`, `models` and so on.
  - Need both `positive` and `negative` test.
### Docker Reference
- Build `docker build -t hire_docker_api .`
- Run `docker run -d -p 3000:3000 --env-file ./.docker.development.env hire_docker_api`
- Bash in container `docker exec -it <container_id> /bin/sh`
- Develop: `docker-compose up -d`
- Destroy: `docker-compose down`
### Bugs
- [Host.docker.internal not resolved on Linux](https://github.com/botfront/botfront-starter/issues/1)
