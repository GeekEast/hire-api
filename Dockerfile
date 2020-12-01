FROM node:12.13-alpine As Development
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn build
ENV NODE_ENV=production
CMD ["node", "dist/main"]