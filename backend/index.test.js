const app = require('./app'); // Link to your server file
const supertest = require('supertest');
const request = supertest(app);

let tempUserId = '';
let tempUserId_2 = '';
let tempListingId = '';

it('Unit Test: GETS the test endpoint', async done => {
  const response = await request.get('/test')

  expect(response.status).toBe(200);
  expect(response.body.message).toBe('pass!');
  done();
});

it('Unit Test: POST new user1', async done =>{
  body = {email: 'test_email@test.com', password: 'test'};
  const response = await request.post('/signup')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(201);
  tempUserId_2 = response.body.userId;
  const response2 = await request.post('/add_user_fcm_token')
                                 .send({userId: tempUserId_2,
                                        token: response.body.userId
                                  })
                                 .set('Accept','application/json');
  expect(response2.status).toBe(200);
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

it('Unit Test: LOGIN user1', async done =>{
  body = {email: 'test_email@test.com', password: 'test'};
  const response = await request.post('/login')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(201);
  done();
});

it('Unit Test: Fail to LOGIN user1, wrong password/user combo', async done =>{
  body = {email: 'test_email@test.com', password: 'test2'};
  const response = await request.post('/signup')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(401);
  done();
});

it('Unit Test: POST new user2 and POST FCM TOKEN', async done =>{
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

it('Unit Test: Find Listing through default filter. Save search history. No listings added yet.', async done =>{
  body = {userId: tempUserId,
          bedMin: 0,
          bedMax: 5,
          bathMin: 0,
          bathMax: 5,
          priceMin: 0,
          priceMax: 5000,
          poiRangeMax: 20,
          latitude: null,
          longitude: null
        };
  const response = await request.post('/save_search_history')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(200);
  expect(response.body.numResults).toBe(0);
  done();
});

it('Unit Test: POST New Listing for user 1', async done =>{
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

it('Unit Test: Delete Listing for non-existant Listing', async done =>{
  body = {listingId: tempListingId};
  const response = await request.post('/delete_listing')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(401);
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

it('Unit Test: Find No Listings through invalid filter.', async done =>{
  body = {userId: tempUserId,
          bedMin: 3,
          bedMax: 4,
          bathMin: 3,
          bathMax: 4,
          priceMin: 100,
          priceMax: 200
        };
  const response = await request.post('/get_listings_by_filter')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(0);
  done();
});

it('Unit Test: Find Listing through valid filter.', async done =>{
  body = {userId: tempUserId,
          bedMin: 1,
          bedMax: 2,
          bathMin: 1,
          bathMax: 2,
          priceMin: 200,
          priceMax: 700
        };
  const response = await request.post('/get_listings_by_filter')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(1);
  done();
});

it('Unit Test: Find No Listings through invalid filter for User 1. Save search history.', async done =>{
  body = {userId: tempUserId,
          bedMin: 3,
          bedMax: 4,
          bathMin: 3,
          bathMax: 4,
          priceMin: 100,
          priceMax: 200,
          poiRangeMax: 10,
          latitude: 0,
          longitude: 0
        };
  const response = await request.post('/save_search_history')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(200);
  expect(response.body.latitude).toBe(0);
  done();
});

it('Unit Test: Get Recommended Roommate. No match.', async done =>{
  body = {userId: tempUserId_2};
  const response = await request.get('/get_recommended_roommates')
                                .query(body);
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(0);
  done();
});

it('Unit Test: Find Listing through valid filter for User 1 and 2. Save search history', async done =>{
  body = {userId: tempUserId,
          bedMin: 1,
          bedMax: 2,
          bathMin: 1,
          bathMax: 2,
          priceMin: 200,
          priceMax: 700,
          poiRangeMax: 10,
          latitude: 0,
          longitude: 0
        };
  const response = await request.post('/save_search_history')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(200);
  expect(response.body.latitude).toBe(0);

  body = {userId: tempUserId_2,
          bedMin: 1,
          bedMax: 2,
          bathMin: 1,
          bathMax: 2,
          priceMin: 200,
          priceMax: 700,
          poiRangeMax: 10,
          latitude: 0,
          longitude: 0
        };
  const response2 = await request.post('/save_search_history')
                                .send(body)
                                .set('Accept','application/json');
  expect(response2.status).toBe(200);
  expect(response2.body.latitude).toBe(0);
  done();
});

it('Unit Test: Get Recommended Roommate for User 2. Single match.', async done =>{
  body = {userId: tempUserId_2};
  const response = await request.get('/get_recommended_roommates')
                                .query(body);
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(1);
  done();
});

it('Unit Test: Find Listing through default filter for User 1. Save search history', async done =>{
  body = {userId: tempUserId,
          bedMin: 0,
          bedMax: 5,
          bathMin: 0,
          bathMax: 5,
          priceMin: 0,
          priceMax: 5000,
          poiRangeMax: 20,
          latitude: null,
          longitude: null
        };
  const response = await request.post('/save_search_history')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(200);
  expect(response.body.latitude).toBe(0);
  done();
});

it('Unit Test: Delete Listing for User 1', async done =>{
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
