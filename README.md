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

### Bugs
- [Host.docker.internal not resolved on Linux](https://github.com/botfront/botfront-starter/issues/1)

### Problem
- No-SQL Cascading Problem when you want to scale the application?
- use cases for mongodb
<p align="center"><img style="display: block; width: 600px; margin: 0 auto;" src=img/2020-12-02-21-19-01.png alt="no image found"></p>

- What does the `Story` mean in the project requirement pdf?
### What Need to Do?
- Testing on Relational Entity Updates (Current)
- API Design **Documentation** (Future)
- Database cascading operation as middleware (Future)
- Seeding Data Scripts (Optional)
- Unit Testing (Future)
  - Currently, there are dependencies between each module, which is not ideal at all.
  - In future, we need **mock** 3rd party `providers`, `models` and so on. Bunch of workload.
  - Need both `positive` and `negative` test.
- Enable CORS (Future)