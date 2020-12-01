## Development
- You need `.development.env` to include all the environment variables for development.
- You need `docker-entrypoint-initdb.d` to init your dockerized mongodb.

## Docker
- build `docker build -t hire_docker_api .`
- run `docker run -p 3000:3000 --env-file ./.development.env hire_docker_api`
- keep running `docker run -td hire_docker_api`
- list container `docker container ls`
- run bash interactively `docker exec -it <container_id> bash `