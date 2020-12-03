if [[ "$MODE" == "docker" ]]; then export MONGODB_HOST=$(dig +short host.docker.internal); else echo "not docker"; fi
yarn start:dev
