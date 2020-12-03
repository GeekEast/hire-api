FROM node:12.13-alpine As Development
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn build
CMD ["node","dist/main"]