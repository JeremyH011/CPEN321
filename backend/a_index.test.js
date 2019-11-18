const app = require('./app'); // Link to your server file

it('Unit Test: getOIdFromUserId', () => {
  const getOIdMock = jest.spyOn(app, "getOIdFromUserId");

  getOIdMock.mockImplementation(()=> "mock");
  expect(app.getOIdFromUserId("test")).toEqual("mock");

  getOIdMock.mockRestore();
  expect(app.getOIdFromUserId('5dd1def4ab55ef642822da05')).not.toBeNull();
});

it('Unit Test: saveSearchHistory', () => {
  const getOIdMock = jest.spyOn(app, "getOIdFromUserId");
  getOIdMock.mockImplementation(()=> "mock");

  const s_s = jest.spyOn(app, "saveSearchHistory");
  s_s.mockImplementation((mock)=>{return app.getOIdFromUserId("mock")});
  expect(app.saveSearchHistory({body:{userId: "mock"}})).toEqual("mock");

  getOIdMock.mockRestore();
  s_s.mockRestore();
});

it('Unit Test: isDefaultSearch. True and False conditions.', () => {
  var body = {
    userId: null,
    bedMin: 0,
    bedMax: 5,
    bathMin: 0,
    bathMax: 5,
    priceMin: 0,
    priceMax: 5000,
    poiRangeMax: 20,
    latitude: null,
    longitude: null
  }
  expect(app.isDefaultSearch({body: body})).toEqual(true);
  body['latitude'] = 0;
  expect(app.isDefaultSearch({body: body})).toEqual(false);
});

it('Unit Test: doesSearchHaveLocationFilter. True and False conditions.', () => {
  var body = {
    userId: null,
    bedMin: 0,
    bedMax: 5,
    bathMin: 0,
    bathMax: 5,
    priceMin: 0,
    priceMax: 5000,
    poiRangeMax: 20,
    latitude: null,
    longitude: null
  }
  expect(app.doesSearchHaveLocationFilter(body)).toEqual(false);
  body['latitude'] = 0;
  body['longitude'] = 0;
  body['poiRangeMax'] = 10;
  expect(app.doesSearchHaveLocationFilter(body)).toEqual(true);
});

it('Unit Test: doesReqHaveLocationFilter. True and False conditions.', () => {
  var body = {
    userId: null,
    bedMin: 0,
    bedMax: 5,
    bathMin: 0,
    bathMax: 5,
    priceMin: 0,
    priceMax: 5000,
    poiRangeMax: 20,
    latitude: null,
    longitude: null
  }
  expect(app.doesReqHaveLocationFilter({body: body})).toEqual(false);
  body['latitude'] = 0;
  body['longitude'] = 0;
  body['poiRangeMax'] = 10;
  expect(app.doesReqHaveLocationFilter({body: body})).toEqual(true);
});
