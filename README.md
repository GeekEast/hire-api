## Development
- You need `.development.env` to include all the environment variables for development.
- You need `docker-entrypoint-initdb.d` to init your dockerized mongodb.

## Docker
- build `docker build -t hire_docker_api .`
- run `docker run -p 3000:3000 --env-file ./.development.env hire_docker_api`
- keep running `docker run -p 3000:3000 --env-file ./.development.env hire_docker_api`
- get into container `docker exec -it <container_id> /bin/sh`
> To run the app locally in docker, please use resolved IP address of the host, rather than `host.docker.internal` 
## Bug Report
- [Host.docker.internal not resolved on Linux](https://github.com/botfront/botfront-starter/issues/1)