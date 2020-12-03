<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

### Theory
Mongo is not relational database. So design of the data structure can be quite different from common relational database practice. 
- Entity: `User`, `Company`, `Vacancy`
- Relationship:
  - `company` vs `user`: One to Many
  - `company` vs `vacancy`: One to Many
- Foreign Key:
  - `User`'s reference should not be stored in `company` as an **unbounded** array.
  - `Vacancy`'s reference should not be stored in `company` as an **unbouded** array.
  - **Relation** updated should only be handling in the `One` side of relation.
  - For an entity that can behave like an attribute to another entity, it should be stored as nested `json` format.
  - Avoid `Circular Dependency` of module in nestjs as much as I can.

### Start
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
db = db.getSiblingDB('dbname');
db.createUser({
  user: 'dbuser',
  pwd: 'dbpassword',
  roles: [{ role: 'readWrite', db: 'dbname' }],
});

```
- Please make sure your local `API_PORT` is not used by other program.
- develop locally `yarn start:dev`
- develop in docker `docker-compose up -d`

### Postman
- Please import `test/HIRE API.postman_collection.json` into Postman v2.1 and test.
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
- `docker-compose.yml` env vars injection happens in after `docker run`, not when `docker build`.
### Problems
- [Host.docker.internal not resolved on Linux](https://github.com/botfront/botfront-starter/issues/1), solution:
> By default Compose sets up a single network for your app. Each container for a service joins the default network and is both reachable by other containers on that network, and discoverable by them at a hostname identical to the container name.
- Should develop `GraphQL` first, then `API` and then `MongoDB`. (**Mongo way**)
- Grapql should be responsible for `assembling` data from API **dumb** endpoints.