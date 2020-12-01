export default () => ({
  jwt: {
    secrect: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE,
  },
  mongodb: {
    uri: process.env.MONGODB_URI,
    username: process.env.MONGODB_USERNAME,
    password: process.env.MONGODB_PASSWORD,
    name: process.env.MONGODB_DBNAME,
    host: process.env.MONGODB_HOST,
    port: parseInt(process.env.MONGODB_PORT),
  },
});
