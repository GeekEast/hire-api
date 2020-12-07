import request from 'supertest';

describe('AppController (e2e)', () => {
  it('/ (GET)', () => {
    return request('http://localhost:3000')
      .get('/')
      .expect(200)
      .expect('Welcome to the Hire API.');
  });
});
