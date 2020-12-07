import { CompanySchema, uri } from './constants';
import request from 'supertest';
import axios from 'axios';
import mongoose from 'mongoose';
import _ from 'lodash';
const base_url = 'http://localhost:3000';

describe('Company (e2e)', () => {
  let user_jwt_token: string;
  let admin_jwt_token: string;

  beforeAll(async () => {
    try {
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await mongoose.connection.dropCollection('companies');
    } catch (err) {
      console.log('companies collection may not exists!');
    }
    await axios.get(`${base_url}/seed`);
    const { data: user_data } = await axios.post(`${base_url}/signin`, {
      username: 'bob',
      password: 'bob',
    });
    const { data: admin_data } = await axios.post(`${base_url}/signin`, {
      username: 'mark',
      password: 'mark',
    });
    user_jwt_token = user_data.access_token;
    admin_jwt_token = admin_data.access_token;
  });

  describe('/companies (GET)', () => {
    it('should return ok to user role', async () => {
      await request(`${base_url}/companies`)
        .get('/')
        .set('Authorization', `Bearer ${user_jwt_token}`)
        .expect(200);
    });

    it('should a list of companies with only PreditiveHire', async () => {
      await request(`${base_url}/companies`)
        .get('/')
        .set('Authorization', `Bearer ${user_jwt_token}`)
        .expect(200)
        .expect(({ body }) => {
          expect(body).toHaveLength(1);
          const company = body[0];
          expect(company.name).toEqual('PredictiveHire');
          expect(company.address).toEqual('15 Newton St');
        });
    });
  });

  describe('/companies/:id (GET)', () => {
    it('should return an object if the company with id exists', async () => {
      const companies = await mongoose
        .model('companies', CompanySchema)
        .find()
        .limit(1);
      const company = _.get(companies, 0);
      const id = _.get(company, ['_id']);
      await request(`${base_url}/companies/${id}`)
        .get('/')
        .set('Authorization', `Bearer ${user_jwt_token}`)
        .expect(200)
        .expect(({ body }) => {
          expect(body.id).toEqual(String(company['_id']));
          expect(body.name).toEqual(String(company['name']));
          expect(body.address).toEqual(String(company['address']));
        });
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
});
