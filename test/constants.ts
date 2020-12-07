import { Schema } from 'mongoose';

const username = process.env.MONGODB_USERNAME || 'api_user';
const password = process.env.MONGODB_PASSWORD || 'api1234';
const dbname = process.env.MONGODB_DBNAME || 'api_dev_db';
const host = process.env.MONGODB_HOST || 'localhost';
const port = parseInt(process.env.MONGODB_PORT) || 27017;

export const uri = `mongodb://${username}:${password}@${host}:${port}/${dbname}`;

export const CompanySchema = new Schema({
  name: String,
  address: String,
});
