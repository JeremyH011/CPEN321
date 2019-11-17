const app = require('./app'); // Link to your server file
const supertest = require('supertest');
const request = supertest(app);

it('GETS the test endpoint', async done => {
  const response = await request.get('/test')

  expect(response.status).toBe(200);
  expect(response.body.message).toBe('pass!');
  done();
});

it('POST new user', async done =>{
  body = {email: 'test_email@test.com', password: 'test'};
  const response = await request.post('/signup')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(201);
  done();
});

it('Cannot use already existing email for new user', async done =>{
  body = {email: 'test_email@test.com', password: 'test'};
  const response = await request.post('/signup')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(401);
  done();
});

it('LOGIN user', async done =>{
  body = {email: 'test_email@test.com', password: 'test'};
  const response = await request.post('/login')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(201);
  done();
});
