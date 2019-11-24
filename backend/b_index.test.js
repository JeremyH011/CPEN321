const app = require('./app'); // Link to your server file
const supertest = require('supertest');
const request = supertest(app.app);

let tempUserId = '';
let tempUserId_2 = '';
let tempUserId_3 = '';
let tempListingId = '';
let tempChatRoomID = '';

it('Integration Test: GETS the test endpoint', async done => {
  const response = await request.get('/test')

  expect(response.status).toBe(200);
  expect(response.body.message).toBe('pass!');
  done();
});

it('Integration Test: POST New Listing for null user. Delete using ID.', async done =>{
  body = {latitude: 0,
          longitude: 0,
          price: 500,
          numBeds: 1,
          numBaths: 1,
          userId: null
        };

  var response = await request.post('/create_listing')
                              .send(body)
                              .set('Accept','application/json');
  expect(response.status).toBe(200);
  expect(response.body.message).toBe('Saved!');

  response = await request.get('/get_listings');
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(1);
  tempListingId = response.body[0]._id;

  body = {listingId: tempListingId};
  response = await request.post('/delete_listing')
                          .send(body)
                          .set('Accept','application/json');
  expect(response.status).toBe(200);
  tempListingId = '';
  done();
});

it('Integration Test: POST new user1', async done =>{
  body = {email: 'test_email@test.com', password: 'test', optIn : true};
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

it('Integration Test: Cannot use already existing email for new user', async done =>{
  body = {email: 'test_email@test.com', password: 'test', optIn : true};
  const response = await request.post('/signup')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(401);
  done();
});

it('Integration Test: LOGIN user1', async done =>{
  body = {email: 'test_email@test.com', password: 'test', optIn : true};
  const response = await request.post('/login')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(201);
  done();
});

it('Integration Test: Fail to LOGIN user1, wrong password/user combo', async done =>{
  body = {email: 'test_email@test.com', password: 'test2', optIn : true};
  const response = await request.post('/login')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(401);
  done();
});

it('Integration Test: POST new user2 and POST FCM TOKEN', async done =>{
  body = {email: 'test_email2@test.com', password: 'test2', optIn : true};
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

it('Integration Test: POST new user3 and no FCM TOKEN', async done =>{
  body = {email: 'test_email3@test.com', password: 'test3', optIn : true};
  const response = await request.post('/signup')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(201);
  tempUserId_3 = response.body.userId;
  done();
});

it('Integration Test: Empty List returned, user has no listings posted', async done =>{
  body = {userId: tempUserId};
  const response = await request.post('/get_listings_by_userId')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(0);
  done();
});

it('Integration Test: Find Listing through default filter. Save search history. No listings added yet.', async done =>{
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

it('Integration Test: POST New Listing for user 1', async done =>{
  body = {latitude: 0,
          longitude: 0,
          price: 500,
          numBeds: 1,
          numBaths: 1,
          userId: tempUserId
        };

  const response = await request.post('/create_listing')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(200);
  expect(response.body.message).toBe('Saved!');
  done();
});

it('Integration Test: Delete Listing for non-existant Listing', async done =>{
  body = {listingId: tempListingId};
  const response = await request.post('/delete_listing')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(401);
  done();
});

it('Integration Test: Get ALL listings, should be 1.', async done =>{
  const response = await request.get('/get_listings');
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(1);
  tempListingId = response.body[0]._id;
  done();
});

/*
it('Integration Test: Create Message with ID', async done=>{
  body = {};
  const response = await request.post('/create_message')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(201);
  done();
});

it('Integration Test: Get Messages with ID', async done=>{
  body = {};
  const response = await request.get('/get_messages_by_chatroom_id')
                                .query(body)
  expect(response.status).toBe(200);
  done();
});
*/
it('Integration Test: GET Listing by listing_id.', async done =>{
  body = {userId: tempListingId};
  const response = await request.get('/get_listing_by_id')
                                .query(body);
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(1);
  done();
});

it('Integration Test: GET Listings by user_id.', async done =>{
  body = {userId: tempUserId};
  const response = await request.post('/get_listings_by_userId')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(1);
  done();
});

it('Integration Test: Find Listing through default filter.', async done =>{
  body = {userId: tempUserId,
          bedMin: 0,
          bedMax: 5,
          bathMin: 0,
          bathMax: 5,
          priceMin: 0,
          priceMax: 5000,
          poiRangeMax: 20,
        };
  const response = await request.post('/get_listings_by_filter')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(1);
  done();
});

it('Integration Test: Find Listing through valid filter.', async done =>{
  body = {userId: tempUserId,
          bedMin: 1,
          bedMax: 2,
          bathMin: 1,
          bathMax: 2,
          priceMin: 200,
          priceMax: 700,
          poiRangeMax: 10,
        };
  const response = await request.post('/get_listings_by_filter')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(1);
  done();
});

it('Integration Test: Find No Listings through invalid filter, bedMin and Max no match.', async done =>{
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
  const response = await request.post('/get_listings_by_filter')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(0);
  done();
});

it('Integration Test: Find No Listings through invalid filter, radius no match.', async done =>{
  body = {userId: tempUserId,
          bedMin: 1,
          bedMax: 2,
          bathMin: 1,
          bathMax: 2,
          priceMin: 200,
          priceMax: 700,
          poiRangeMax: 10,
          latitude: 0,
          longitude: 180
        };
  const response = await request.post('/get_listings_by_filter')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(0);
  done();
});

it('Integration Test: Find No Listings through invalid filter for User 1. Save search history.', async done =>{
  body = {userId: tempUserId,
          bedMin: 3,
          bedMax: 4,
          bathMin: 3,
          bathMax: 4,
          priceMin: 600,
          priceMax: 1000,
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

it('Integration Test: Get Recommended Roommate. No match.', async done =>{
  body = {userId: tempUserId_2};
  const response = await request.get('/get_recommended_roommates')
                                .query(body);
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(0);
  done();
});

it('Integration Test: Find Listing through valid filter for User 1, 2, and 3. Save search history', async done =>{
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

  body = {userId: tempUserId_2,
          bedMin: 1,
          bedMax: 2,
          bathMin: 1,
          bathMax: 2,
          priceMin: 100,
          priceMax: 800,
          poiRangeMax: 10,
          latitude: 0,
          longitude: 0
        };
  const response3 = await request.post('/save_search_history')
                                .send(body)
                                .set('Accept','application/json');
  expect(response3.status).toBe(200);
  expect(response3.body.latitude).toBe(0);

  body = {userId: tempUserId_3,
          bedMin: 1,
          bedMax: 2,
          bathMin: 1,
          bathMax: 2,
          priceMin: 100,
          priceMax: 800,
          poiRangeMax: 10,
          latitude: 0,
          longitude: 0
        };
  const response4 = await request.post('/save_search_history')
                                .send(body)
                                .set('Accept','application/json');
  expect(response4.status).toBe(200);
  expect(response4.body.latitude).toBe(0);
  done();
});

it('Integration Test: Get Recommended Roommate for User 2. Single match.', async done =>{
  body = {userId: tempUserId_2};
  const response = await request.get('/get_recommended_roommates')
                                .query(body);
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(2);
  done();
});

it('Integration Test: Find Listing through default filter for User 1. Save search history', async done =>{
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

it('Integration Test: Delete Listing for User 1', async done =>{
  body = {listingId: tempListingId};
  const response = await request.post('/delete_listing')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(200);
  done();
});

it('Integration Test: Get ALL listings, should be empty now.', async done =>{
  const response = await request.get('/get_listings');
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(0);
  done();
});

it('Integration Test: Get Chat Room by User IDs no room', async done =>{
  body = {userId1: tempUserId_2, userId2: tempUserId_3};
  const response = await request.post('/get_chat_room_by_user_ids')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(401);
  done();
});

it('Integration Test: Create Chat Room', async done =>{
  body = {userId1: tempUserId_2, userId2: tempUserId_3};
  const response = await request.post('/create_chat_room')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(201);
  tempChatRoomID = response.body.chatRoomId;
  done();
});

it('Integration Test: Get Chat Rooms by User ID room exists', async done =>{
  body = {userId: tempUserId_2};
  const response = await request.post('/get_chat_rooms_by_user_id')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(200);
  done();
});

it('Integration Test: Create Message', async done =>{
  body = {senderId: tempUserId_3,
          receiverId: tempUserId_2,
          chatRoomId: tempChatRoomID,
          content: 'hi'
        };
  const response = await request.post('/create_message')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(201);
  done();
});

it('Integration Test: Get messages by chat room ID.', async done =>{
  body = {chatRoomId: tempChatRoomID};
  const response = await request.post('/get_messages_by_chatroom_id')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(0);
  done();
});

it('Integration Test: Get user by id.', async done =>{
  body = {userId: tempUserId_2};
  const response = await request.post('/get_user_by_id')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(1);
  done();
});

it('Integration Test: Update User Data. expect count > 0', async done =>{
  body = {userId: tempUserId_3,
          name: 'test three', 
          age: '69', 
          job: 'random house',
          email: 'test_email3@test.com',
          optIn : false};
  const response = await request.post('/update_user_data')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(200);
  done();
});

it('Integration Test: Update User Data. expect count == 0', async done =>{
  body = {userId: tempUserId_3,
          name: 'test three', 
          age: '69', 
          job: 'random house',
          email: 'dontexist@email.com',
          optIn : false};
  const response = await request.post('/update_user_data')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(200);
  done();
});

it('Integration Test: Update User Photo', async done =>{
  body = {userId: tempUserId_3,
          photo: 'random_string_photo'};
  const response = await request.post('/update_user_photo')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(200);
  done();
});

it('Integration Test: Create Review for User', async done=>{
  body = {revieweeId: tempUserId,
          reviewerId: tempUserId_2,
          reviewerName: 'my man',
          revieweeName: 'nice apple',
          relationship: 'landlord',
          reviewRating: 5,
          reviewText: 'good experience'};
  const response = await request.post('/create_review')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(200);
  done();
});


it('Integration Test: Create Review for User', async done=>{
  body = {userId: tempUserId};
  const response = await request.post('/get_reviews_by_reviewer_id')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(200);
  done();
});


it('Integration Test: Create Review for User', async done=>{
  body = {userId: tempUserId_2};
  const response = await request.post('/get_reviews_by_reviewee_id')
                                .send(body)
                                .set('Accept','application/json');
  expect(response.status).toBe(200);
  done();
});