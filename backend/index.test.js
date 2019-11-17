const app = require('./app'); // Link to your server file
const supertest = require('supertest');
const request = supertest(app);

let tempUserId = '';
let tempListingId = '';

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
  tempUserId = response.body.userId;
  const response2 = await request.post('/add_user_fcm_token')
                                 .send({userId: tempUserId,
                                        token: response.body.userId
                                  })
                                 .set('Accept','application/json');
  expect(response2.status).toBe(200);
  done();
});

it('Unit Test: Empty List returned, user has no listings posted', async done =>{
  body = {userId: tempUserId};
  const response = await request.post('/get_listings_by_usedId')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(0);
  done();
});

it('Unit Test: POST New Listing', async done =>{
  body = {latitude: 0,
          longitude: 0,
          price: 500,
          numBeds: 1,
          numBaths: 1,
          userId: tempUserId};
  const response = await request.post('/create_listing')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(200);
  expect(response.body.message).toBe('Saved!');
  done();
});

it('Unit Test: Get ALL listings, should be 1.', async done =>{
  const response = await request.get('/get_listings');
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(1);
  tempListingId = response.body[0]._id;
  console.log(`Listing ID: ${tempListingId}`);
  done();
});

it('Unit Test: Should find specific listing just created.', async done =>{
  body = {userId: tempUserId};
  const response = await request.post('/get_listings_by_usedId')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(1);
  done();
});

it('Unit Test: Delete Listing', async done =>{
  body = {listingId: tempListingId};
  const response = await request.post('/delete_listing')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(200);
  done();
});

it('Unit Test: Get ALL listings, should be empty now.', async done =>{
  const response = await request.get('/get_listings');
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(0);
  done();
});
