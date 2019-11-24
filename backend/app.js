const express = require('express');
//const mongoclient = require('mongodb').MongoClient;
//const multer = require('multer')
const bodyParser = require('body-parser');
const geolib = require('geolib');
//const admin = require('firebase-admin');
//const serviceAccount = require("./firebase.json");

const app = express();
var constants = require("./constants");

/*
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: constants.FIREBASE_DB_URL
});*/

var jsonParser = bodyParser.json();
app.use(bodyParser.json());

/*
mongoclient.connect(constants.MONGO_DB_URL, (err,client) => {
  db = client.db(constants.MONGO_DB_NAME);
});*/

var db_con = require('./connections/db_connections');
var db;
db_con.connect(() => {
  db = db_con.get();

  var fs_con = require('./connections/storage.js');
  var upload;
  fs_con.init(() => {
    upload = fs_con.get();

    app.use('/public/images', express.static('public/images'));

    var fb_con = require('./connections/fb_connections');
    var admin;
    fb_con.init(()=>{
      admin = fb_con.get();

      var login = require('./routes/login');
      app.use(login);

      var users = require('./routes/users');
      app.use(users);

      var listings = require('./routes/listings');
      app.use(listings);

      var reviews = require('./routes/reviews');
      app.use(reviews);

      var chat = require('./routes/chat');
      app.use(chat);

      var filter = require('./routes/filter');
      app.use(filter);
    });
  });
});

/*
const Storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, './public/images')
  },
  filename(req, file, callback) {
    callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`)
  },
});

const upload = multer({ storage: Storage });*/
const BED_MAX = 5;
const BATH_MAX = 5;
const PRICE_MAX = 5000;
const POI_RANGE_MAX = 20;
const MAX_NUM = 9999999;
const DEFAULT_LAT_DELTA = 0.0622;
const DEFAULT_LONG_DELTA = 0.0421;
const VIEWPORT_BUFFER = 0.005;

function getOIdFromUserId(userId){
  var mongo = require('mongodb');
  //console.log(userId);
  return new mongo.ObjectID(userId);
}

function saveSearchHistory(req){
  req.body.userId = getOIdFromUserId(req.body.userId);
  db.collection("searchHistory").insertOne(req.body, (err, result) => {
    if (err) {
      return -1;
    }
    return 0;
  });
}

function isDefaultSearch(req){
  return req.body.poiRangeMax == POI_RANGE_MAX && req.body.latitude == null && req.body.longitude == null && req.body.bedMin == 0 && req.body.bedMax == BED_MAX &&
  req.body.bathMin == 0 && req.body.bathMax == BATH_MAX && req.body.priceMin == 0 && req.body.priceMax == PRICE_MAX;
}


function doesSearchHaveLocationFilter(req) {
  return req.poiRangeMax != POI_RANGE_MAX && req.latitude != null && req.longitude != null;
}

function doesReqHaveLocationFilter(req) {
  return req.body.poiRangeMax != POI_RANGE_MAX && req.body.latitude != null && req.body.longitude != null;
}

// precondition: ONLY CALL IF req.body has a poi range
function filterForLocations(result, req) {
  var locationFiltered = [];
  result.forEach(function(listing){
    if (geolib.isPointWithinRadius(
      { latitude: listing.latitude, longitude: listing.longitude },
      { latitude: req.body.latitude, longitude: req.body.longitude },
      (req.body.poiRangeMax * 1000))) // * 1000 km -> m
    {
      locationFiltered.push(listing);
    }
  });
  return locationFiltered;
}

app.get('/test', (req, res) => {
  res.json({message: 'pass!'});
});

module.exports = {
  app: app,
  getOIdFromUserId: getOIdFromUserId,
  saveSearchHistory: saveSearchHistory,
  isDefaultSearch: isDefaultSearch,
  doesSearchHaveLocationFilter: doesSearchHaveLocationFilter,
  doesReqHaveLocationFilter: doesReqHaveLocationFilter,
  filterForLocations: filterForLocations
};
