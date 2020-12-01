FROM node:10.23.0
WORKDIR /usr/src/app
COPY package.json ./
RUN yarn install
COPY . .
# RUN yarn build
EXPOSE 3000
# CMD ["yarn", "start:prod"]
