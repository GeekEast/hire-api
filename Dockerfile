FROM node:12.13-alpine As Development
RUN apk add bind-tools
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install
COPY . .
RUN chmod +x ./start.docker.sh
RUN yarn build
CMD ["node","dist/main"]