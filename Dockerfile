FROM node:12.13-alpine As Development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
# RUN npm run build

# FROM node:12.13-alpine as production
# ENV NODE_ENV=production
# WORKDIR /usr/src/app
# COPY package*.json ./
# RUN npm install --only=production
# COPY . .
# COPY --from=development /usr/src/app/dist ./dist
# CMD ["node", "dist/main"]

# mongo "mongodb+srv://devconnectordb.7cjfr.mongodb.net/<dbname>" --username admin