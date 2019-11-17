const app = require('./app'); // Link to your server file
const supertest = require('supertest');
const request = supertest(app);

it('Unit Test: GETS the test endpoint', async done => {
  const response = await request.get('/test')

  expect(response.status).toBe(200);
  expect(response.body.message).toBe('pass!');
  done();
});

it('Unit Test: POST new user', async done =>{
  body = {email: 'test_email@test.com', password: 'test'};
  const response = await request.post('/signup')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(201);
  done();
});

it('Unit Test: Cannot use already existing email for new user', async done =>{
  body = {email: 'test_email@test.com', password: 'test'};
  const response = await request.post('/signup')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(401);
  done();
});

it('Unit Test: LOGIN user', async done =>{
  body = {email: 'test_email@test.com', password: 'test'};
  const response = await request.post('/login')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(201);
  done();
});

it('Unit Test: Fail to LOGIN user, wrong password/user combo', async done =>{
  body = {email: 'test_email@test.com', password: 'test2'};
  const response = await request.post('/signup')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(401);
  done();
});

it('Unit Test: POST new user and POST FCM TOKEN', async done =>{
  body = {email: 'test_email2@test.com', password: 'test2'};
  const response = await request.post('/signup')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(201);

  const response2 = await request.post('/add_user_fcm_token')
                                 .send({token: response.body.userId})
                                 .set('Accept','application/json');
  expect(response2.status).toBe(200);
  done();
});

it('Unit Test: Fail to POST FCM TOKEN for non-existing USER', async done =>{
  const response2 = await request.post('/add_user_fcm_token')
                                 .send({token: 'AAAAAAAAAA'})
                                 .set('Accept','application/json');
  expect(response2.status).toBe(400);
  done();
});
