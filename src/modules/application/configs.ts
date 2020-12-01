export default () => ({
  api: {
    port: process.env.API_PORT,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE,
  },
  mongodb: {
    username: process.env.MONGODB_USERNAME,
    password: process.env.MONGODB_PASSWORD,
    name: process.env.MONGODB_DBNAME,
    host: process.env.MONGODB_HOST,
    port: parseInt(process.env.MONGODB_PORT),
  },
});
