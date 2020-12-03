### Prerequisites
- You need `.development.env` to include all the environment variables for development.
- You need `docker-entrypoint-initdb.d` to init your dockerized mongodb.
- Please make sure your local `port:3000` is free to use.
### Docker
- Build `docker build -t hire_docker_api .`
- run `docker run -d -p 3000:3000 --env-file ./.development.env hire_docker_api`
- get into container `docker exec -it <container_id> /bin/sh`
> To run the app locally in docker, please use resolved IP address of the host, rather than `host.docker.internal`.
- develop: `docker-compose up -d`

### Problem
- No-SQL Cascading Problem when you want to scale the application?
  - keep foreign in only one side or the join table
- Unbounded Array Problem (MongDB Modeling)
  - Don't store array.
- Circulr Dependency (nestjs)
  - Answer is same like the firstone;

### Insights
- Should Develop GraphQL first, then API and then MongoDB. This is the Mongo way.
- Grapql should be responsible for assembling data from API dumb endpoints.
- Follow Solid Principles.
- May need to reference some MongoDB Modeling Patterns.
### What Need to Do?
- sort with pagination.
- Seeding Data Scripts (Optional)
- Add custom global exception handlers.
- Unit Testing (Future)
  - Currently, there are dependencies between each module, which is not ideal at all.
  - In future, we need **mock** 3rd party `providers`, `models` and so on. Bunch of workload.
  - Need both `positive` and `negative` test.

### Bugs
- [Host.docker.internal not resolved on Linux](https://github.com/botfront/botfront-starter/issues/1)
