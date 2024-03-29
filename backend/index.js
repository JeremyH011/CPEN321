const express = require('express');
const mongoclient = require('mongodb').MongoClient;
const multer = require('multer')
const bodyParser = require('body-parser');
const geolib = require('geolib');
const admin = require('firebase-admin');
const serviceAccount = require("./firebase.json");

const app = express();
var constants = require("./constants");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: constants.FIREBASE_DB_URL
});

var jsonParser = bodyParser.json();
app.use(bodyParser.json())

mongoclient.connect(constants.MONGO_DB_URL,(err,client)=> {db = client.db(constants.MONGO_DB_NAME)});

app.use('/public/images', express.static('public/images'));

const Storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, './public/images')
  },
  filename(req, file, callback) {
    callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`)
  },
});

const upload = multer({ storage: Storage });

app.post('/signup', upload.array('photo', 99), jsonParser, (req,res) => {
  req.body['date'] = new Date(Date.now()).toISOString();
  console.log(req.body);
  var request_body = req.body;
  db.collection("users").find({"email":req.body.email}).count(function (err, count){
    if(err) {
      res.sendStatus(400);
    }
    else{
      if (count == 0) {
        request_body['age'] = parseInt(req.body.age);
        request_body['photo'] = req.files;
        console.log(request_body);
        db.collection("users").insertOne(request_body, (err, result) => {
          if(err) {
            res.sendStatus(400);
          } else {
            res.writeHead(201, {'Content-Type': 'application/json'});
            var userIdObj = {
              userId: result.insertedId
            }
            res.end(JSON.stringify(userIdObj));
          }
        });
      } else {
        res.sendStatus(401);
      }
    }
  });
});

app.post('/login', jsonParser, (req,res) => {
  console.log(req.body);
  db.collection("users").find(req.body).toArray(function (err, result){
    console.log(result);
    if(err) {
      res.sendStatus(400);
    } else if (result.length > 0) {
      res.writeHead(201, {'Content-Type': 'application/json'});
      var userIdObj = {
        userId: result[0]._id
      }
      res.end(JSON.stringify(userIdObj));

    } else {
      res.sendStatus(401);
    }

  });
});

app.post('/add_user_fcm_token', jsonParser, (req,res) => {
  console.log("ADDING TOKEN " + req.body.token + " for user " + req.body.userId);

  var o_id = getOIdFromUserId(req.body.userId);

  db.collection("users").updateOne({_id : o_id}, {$set: {fcmToken : req.body.token}}, function(err,result){
    if(err){
      res.sendStatus(400);
    }
    else{
      res.sendStatus(200);
    }
  });
});

app.post('/get_user_by_id', jsonParser, (req, res) => {
  console.log(req.body);

  var o_id = getOIdFromUserId(req.body.userId);

  db.collection("users").find({
    _id: { $eq : o_id },
  }).toArray((err,result) => {
    if(err){
      res.sendStatus(400);
    }
    else{
      console.log(result);
      res.send(result);
    }
  });
});

app.post('/update_user_photo', upload.array('photo', 99), jsonParser, (req,res) => {
  console.log("UPDATING USER PHOTO FOR USER " + req.body.userId);

  var o_id = getOIdFromUserId(req.body.userId);
  var request_body = req.body;
  request_body['photo'] = req.files;
  console.log("request body ", request_body);

  db.collection("users").updateOne({_id : o_id}, {$set: { photo: request_body['photo'] }}, function(err,result){
    if(err){
      res.sendStatus(400);
    }
    else{
      console.log("req.body ", req.body);
      res.sendStatus(200);
    }
  });
});

app.post('/update_user_data', jsonParser, (req,res) => {
  console.log("UPDATING USER DATA FOR USER " + req.body.userId);

  var o_id = getOIdFromUserId(req.body.userId);
  var request_body = req.body;

  db.collection("users").find({"email":req.body.email}).count(function (err, count){
    if(err) {
      res.sendStatus(400);
    }
    else{
      if(count == 0) {
        db.collection("users").updateOne({_id : o_id}, {$set: { name : request_body['name'],
                              age : request_body['age'], email : request_body['email'],
                              job : request_body['job'], optIn : request_body['optIn'], }}, function(err,result){
          if(err){
            res.sendStatus(400);
          }
          else{
            console.log(req.body);
            res.sendStatus(200);
          }
        });
      } else {
        db.collection("users").find({"email":req.body.email}).toArray(function (err, result) {
          if(err) {
            res.sendStatus(400);
          } else if (result[0]._id == req.body.userId) {
            db.collection("users").updateOne({_id : o_id}, {$set: { name : req.body.name,
                                   age : req.body.age, email : req.body.email,
                                  job : req.body.job, optIn : req.body.optIn }}, function(err,result){
              if(err){
                res.sendStatus(400);
              }
              else{
                console.log(req.body);
                res.sendStatus(200);
              }
            });
          } else {
            res.sendStatus(401);
          }
        });
      }
    }
  });
});

app.post('/create_review', jsonParser, (req,res) => {
  req.body['date'] = new Date(Date.now()).toISOString();
  console.log("ADDING REVIEW");
  console.log(req.body);
  var request_body = req.body;
  request_body['revieweeId'] = getOIdFromUserId(req.body.revieweeId);
  request_body['reviewerId'] = getOIdFromUserId(req.body.reviewerId);
  request_body['reviewerName'] = req.body.reviewerName;
  request_body['revieweeName'] = req.body.revieweeName;
  request_body['relationship'] = req.body.relationship;
  request_body['reviewRating'] = parseInt(req.body.reviewRating);
  request_body['reviewText'] = req.body.reviewText;

  console.log("Creating review by " + request_body['reviewerId'] + " for " + request_body['revieweeId']);
  console.log(request_body);
  db.collection("reviews").insertOne(request_body, (err, result) => {
    if (err) {
      res.sendStatus(400);
    } else {
      res.sendStatus(200);
    }
  });
});

app.post('/get_reviews_by_reviewer_id', jsonParser, (req, res) => {
  console.log(req.body);

  var o_id = getOIdFromUserId(req.body.userId);
  db.collection("reviews").find({
    reviewerId: { $eq : o_id },
  }).toArray((err,result) => {
    if(err){
      res.sendStatus(400);
    }
    else{
      console.log(result);
      res.send(result);
    }
  });
});

app.post('/get_reviews_by_reviewee_id', jsonParser, (req, res) => {
  console.log(req.body);

  var o_id = getOIdFromUserId(req.body.userId);
  db.collection("reviews").find({
    revieweeId: { $eq : o_id },
  }).toArray((err, result) => {
    if(err){
      res.sendStatus(400);
    } else {
      console.log(result);
      res.send(result);
    }
  });
});

app.get('/get_listings', jsonParser, (req, res) => {
  console.log("GETTING LISTING WITH QUERY: ");
  console.log(req.body);
  db.collection("listings").find(req.body).toArray((err,result) => {
    res.send(result);
  });
});

app.get('/get_listing_by_id', jsonParser, (req, res) => {
  console.log(req.body);

  var o_id = getOIdFromUserId(req.body.userId);

  db.collection("listings").find(o_id).toArray((err,result) => {
    if(err){
      res.sendStatus(400);
    }
    else{
      res.send(result);
    }
  });
});

app.post('/get_listings_by_userId', jsonParser, (req, res) => {
  console.log("GETTING LISTINGS FOR QUERY: " + req.body);

  var o_id = getOIdFromUserId(req.body.userId);

  db.collection("listings").find({
    userId: { $eq : o_id },
  }).toArray((err,result) => {
    if(err){
      res.sendStatus(400);
    }
    else{
      res.send(result);
    }
  });
});

app.post('/delete_listing', jsonParser, (req, res) => {
  console.log(req.body);

  var o_id = getOIdFromUserId(req.body.listingId);

  db.collection("listings").remove({
    _id: { $eq : o_id },
  });

  res.send(200);
});

function getOIdFromUserId(userId){
  var mongo = require('mongodb');
  console.log(userId);
  return new mongo.ObjectID(userId);
}

app.post('/create_listing', upload.array('photo[]', 99), jsonParser, (req,res)=>{
  req.body['date'] = new Date(Date.now()).toISOString();
  console.log(req.body);
  var request_body = req.body;
  request_body['latitude'] = parseFloat(req.body.latitude);
  request_body['longitude'] = parseFloat(req.body.longitude);
  request_body['price'] = parseFloat(req.body.price);
  request_body['numBeds'] = parseInt(req.body.numBeds);
  request_body['numBaths'] = parseInt(req.body.numBaths);
  request_body['photos'] = req.files;
  request_body['userId'] = getOIdFromUserId(req.body.userId);
  request_body['date'] = new Date(Date.now()).toISOString();

  console.log("Create listing\n");
  console.log(req.files);
  console.log(request_body);
  db.collection("listings").insertOne(request_body, (err, result) => {
    db.collection("users").find({ fcmToken : { $exists : true } }).toArray((err, result) => {
      var registrationTokens = result.map(user => user.fcmToken);
      var notificationBody = req.body.address + "\n$" + req.body.price + "/month\n" + req.body.numBeds + " bedrooms";
      var message = {
        notification: {title : 'New Listing', body : notificationBody},
        tokens: [...new Set(registrationTokens)],
      }

      admin.messaging().sendMulticast(message)
      .then((response) => {
        if (response.failureCount > 0) {
          const failedTokens = [];
          response.responses.forEach((resp, idx) => {
            if (!resp.success) {
              failedTokens.push(registrationTokens[idx]);
            }
          });
          console.log('List of tokens that caused failures: ' + failedTokens);
        }
      });
    });
  });

  res.send("Saved");
});

const NUM_LATEST_SEARCHES = 5;
const NUM_FILTERED_BY_PRICE = 100;
const FILTER_RADIUS_KM = 10;
const M_IN_KM = 1000;
const NUM_RECOMMENDED_USERS = 10;
app.get('/get_recommended_roommates', jsonParser, (req, res) => {
  console.log("GETTING USERS WITH QUERY: ");
  console.log(req.query);

  var request_body = {};
  var OId = getOIdFromUserId(req.query.userId);
  request_body['userId'] = OId;

  // Find the latest NUM_LATEST_SEARCHES belonging to this user
  db.collection("searchHistory").find(request_body)
  .sort({date: -1})
  .limit(NUM_LATEST_SEARCHES)
  .toArray((err, result) => {
    if(err){
      return res.sendStatus(400);
    }

    // Find all the searches that have an address
    var arrayOfLatLong = result.filter(search => doesSearchHaveLocationFilter(search))
    .map(function(listing) {
      return {latitude: listing.latitude, longitude: listing.longitude};
    });

    // Get the centroid of the latest searches
    var center = null;
    if(arrayOfLatLong.length != 0){
      center = geolib.getCenterOfBounds(arrayOfLatLong);
    }

    // Determine the price range to filter recommended users on
    var min = PRICE_MAX;
    var max = 0;
    for(let i = 0; i < result.length; i ++){
      if(result[i].priceMin < min){
        min = result[i].priceMin;
      }
      if(result[i].priceMax > max){
        max = result[i].priceMax;
      }
    }

    var initial_collection_history = {$and: [
      {$or: [
        {$and: [
          {priceMin: {$gte: min}},
          {priceMin: {$lte: max}}
        ]},
        {$and: [
          {priceMax: {$gte: min}},
          {priceMax: {$lte: max}}
        ]}
      ]},
      {userId: {$ne: OId}
    }]
  };

  // Find all the users with an overlapping price query
  db.collection("searchHistory").find(initial_collection_history)
  .sort({date : -1})
  .limit(NUM_FILTERED_BY_PRICE)
  .toArray((err, result) => {

    // Filter out irrelevant users based on centroid
    var addr_filtered = result.filter(function(search) {
      // If the user has no centroid, then consider all NUM_FILTERED_BY_PRICE users
      if (center == null) {
        return true;
      } else {
        // If the user did have a centroid, then disregard all searches that did not
        // search by address, or that are more than FILTER_RADIUS_KM kilometers away
        if (search.latitude != null && search.longitude != null) {
          return geolib.isPointWithinRadius({latitude : search.latitude, longitude : search.longitude},
            {latitude : center.latitude, longitude : center.longitude},
            FILTER_RADIUS_KM*M_IN_KM);
          } else {
            return false;
          }
        }
      });

      // Key: UserId, Value: Score
      var score_hash = new Map();

      // Stage 1 of scoring: (Score the users based on overlapping price)
      // min <= priceMin <= max : +1 score
      // min <= priceMax <= max : +1 score
      addr_filtered.forEach(function(element) {
        var score = 0;
        if (element.priceMin >= min && element.priceMax <= max) {
          score++;
        }

        if (element.priceMax >= min && element.priceMax <= max) {
          score++;
        }

        // Convert the ObjectId to string, to get correct hash, because
        // object ids with same string id could have different hashes if in
        // different ObjectID objects
        var hash_key = element.userId.toString();

        if (score_hash.has(hash_key)) {
          score_hash.set(hash_key, score_hash.get(hash_key) + score);
        } else {
          score_hash.set(hash_key, score);
        }
      });

      // Array.from returns [..., {userId,score} ,...], so sort by score
      // and return the list of userIds of the first 10 users with the highest score.
      var score_arr_sorted = Array.from(score_hash).sort(function(a,b) {
        return b[1] - a[1];
      })
      .slice(0,NUM_RECOMMENDED_USERS)
      .map(user => getOIdFromUserId(user[0]));

      db.collection("users").find({$and: [{'optIn' : true},{'_id' : {$in : score_arr_sorted}}]}).toArray((err, result) => {
        if (err) {
          return res.send(400);
        } else {
          return res.send(result);
        }
      });
    });
  });
});

const BED_MAX = 5;
const BATH_MAX = 5;
const PRICE_MAX = 5000;
const POI_RANGE_MAX = 20;
const MAX_NUM = 9999999;
const DEFAULT_LAT_DELTA = 0.0622;
const DEFAULT_LONG_DELTA = 0.0421;
const VIEWPORT_BUFFER = 0.005;
app.post('/save_search_history', jsonParser, (req,res)=>{
  req.body['date'] = new Date(Date.now()).toISOString();
  console.log("Save Search History\n");
  console.log(req.body);

  // get all listings that match the criteria
  db.collection("listings").find( {
    numBeds: { $gte: req.body.bedMin, $lte: req.body.bedMax == BED_MAX ? MAX_NUM : req.body.bedMax },
    numBaths: { $gte: req.body.bathMin, $lte: req.body.bathMax == BATH_MAX ? MAX_NUM : req.body.bathMax},
    price: { $gte: req.body.priceMin, $lte: req.body.priceMax == PRICE_MAX ? MAX_NUM : req.body.priceMax },
  } ).toArray((err,result) => {
    if(err) {
      res.sendStatus(400);
    }
    else {
      // using this geolib library: https://www.npmjs.com/package/geolib
      // only get listings within desired field if poi range is given

      var locationFiltered = [];
      var hasLocationFilter = doesReqHaveLocationFilter(req);
      if (hasLocationFilter == true) {
        locationFiltered = filterForLocations(result, req);
      }

      if (locationFiltered.length == 0 && hasLocationFilter == true) {

        if(saveSearchHistory(req) == -1) {
          return res.sendStatus(400);
        }
        // return default deltas and centered at passed in address since no results found
        res.send({latitude: req.body.latitude, longitude: req.body.longitude,
          latitudeDelta: DEFAULT_LAT_DELTA, longitudeDelta: DEFAULT_LONG_DELTA, numResults: 0});
      }
      else {
        // if there's no location filter then this locationFiltered array was never populated
        if (hasLocationFilter == false) {
          locationFiltered = result;
        }
        if(locationFiltered.length == 0) {
          if(saveSearchHistory(req) == -1){
            return res.sendStatus(400);
          }
          // return default deltas and centered at passed in address since no results found
          return res.send({latitude: req.body.latitude, longitude: req.body.longitude,
            latitudeDelta: DEFAULT_LAT_DELTA, longitudeDelta: DEFAULT_LONG_DELTA, numResults: 0});
        }
        // otherwise, get the bounds of the latitudes and longitudes of the matched listings and return their delta
        // found that syntax here: https://www.freecodecamp.org/news/15-useful-javascript-examples-of-map-reduce-and-filter-74cbbb5e0a1f/
        var arrayOfLatLong = locationFiltered.map(function(listing) {
          return {latitude: listing.latitude, longitude: listing.longitude};
        });
        var bounds = geolib.getBounds(arrayOfLatLong);
        var center = geolib.getCenterOfBounds(arrayOfLatLong);

        if(!isDefaultSearch(req)) {
          if(saveSearchHistory(req) == -1) {
            return res.sendStatus(400);
          }
        }

        res.send({latitude: center.latitude, longitude: center.longitude,
          latitudeDelta: bounds.maxLat - bounds.minLat + VIEWPORT_BUFFER, longitudeDelta: bounds.maxLng - bounds.minLng + VIEWPORT_BUFFER,
          numResults: locationFiltered.length});
      }
    }
  });
});

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

      app.post('/get_listings_by_filter', jsonParser, (req, res) => {
        console.log("GET LISTINGS BY FILTER");
        console.log(req.body);

        // get all listings that match the criteria
        db.collection("listings").find( {
          numBeds: { $gte: req.body.bedMin, $lte: req.body.bedMax == BED_MAX ? MAX_NUM : req.body.bedMax },
          numBaths: { $gte: req.body.bathMin, $lte: req.body.bathMax == BATH_MAX ? MAX_NUM : req.body.bathMax},
          price: { $gte: req.body.priceMin, $lte: req.body.priceMax == PRICE_MAX ? MAX_NUM : req.body.priceMax },
        } ).toArray((err,result) => {
          if(err){
            res.sendStatus(400);
          }
          else{
            // using this geolib library: https://www.npmjs.com/package/geolib
            // only get listings within desired field if poi range is given
            var locationFiltered = [];
            var hasLocationFilter = doesReqHaveLocationFilter(req);
            if (hasLocationFilter == true) {
              locationFiltered = filterForLocations(result, req);
            }
            else { // if there's no location filter then this locationFiltered array should just be the result
              locationFiltered = result;
            }
            res.send(locationFiltered);
          }
        });
      });

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
      req.body.poiRangeMax == POI_RANGE_MAX ? MAX_NUM : (req.body.poiRangeMax * 1000))) // * 1000 km -> m
    {
      locationFiltered.push(listing);
    }
  });
  return locationFiltered;
}

app.post('/get_chat_room_by_user_ids', jsonParser, (req, res) => {
    console.log("get_chat_room_by_user_ids");
    console.log(req.body);

  var currentUserId = getOIdFromUserId(req.body.currentUserId);
  var otherUserId = getOIdFromUserId(req.body.otherUserId);
  
  //https://stackoverflow.com/questions/2008032/mongodb-query-with-an-or-condition
  db.collection("chatRooms").find({
    $or:[{$and:[{userId1: { $eq : otherUserId }},{userId2: { $eq : currentUserId}}]},
            {$and:[{userId2: { $eq : otherUserId }}, {userId1: { $eq : currentUserId}}]},]
  }).toArray((err,result) => {
    if(err){
      res.sendStatus(400);
    }
    else{
       if(result.length == 0)
       {
            res.sendStatus(401);
       }
       else
       {
          res.writeHead(200, {'Content-Type': 'application/json'});
          var chatRoomIdObj = {
            chatRoomId: result[0]._id
          }
          res.end(JSON.stringify(chatRoomIdObj));
       }
    }
  });
});

app.post('/create_chat_room', jsonParser, (req, res) => {
    console.log("create_chat_room");
    console.log(req.body);

    req.body.userId1 = getOIdFromUserId(req.body.userId1);
    req.body.userId2 = getOIdFromUserId(req.body.userId2);
  
    db.collection("chatRooms").insertOne(req.body, (err, result) => {
      if (err) {
            res.sendStatus(400);
      }
      else 
      {
        res.writeHead(201, {'Content-Type': 'application/json'});
        var chatRoomIdObj = {
          chatRoomId: result.insertedId
        }
        res.end(JSON.stringify(chatRoomIdObj));
      }
    });
});

app.post('/get_chat_rooms_by_user_id', jsonParser, (req, res) => {
    console.log("get_chat_rooms_by_user_id");
    console.log(req.body);
  var numberOfRooms = 0;
  var count = 0;   
  var rooms_with_names = [];

  var userId = getOIdFromUserId(req.body.userId);
  console.log("USER ID: " + userId);
  
  get_chat_rooms(function(err, collection) {
      function processRooms(err, rooms) {
          rooms.toArray(function(err, roomsArray) {
              console.log(roomsArray.length);
              numberOfRooms = roomsArray.length;
              count = 0;
              for(const room of roomsArray) {
                  console.log(room);
                  
                  populateNames(room, userId, function updateRoomsWithNames(newRoom) {
                      rooms_with_names.push(newRoom);
                      console.log(rooms_with_names);
                      count++;
                      if (count == numberOfRooms) {
                          finallyReturn();
                      }
                  });

                  console.log("ROOMS WITH NAMES:");
                  console.log(rooms_with_names);
              }
              
          });
      }
      
      function finallyReturn() {
              res.writeHead(200, {'Content-Type': 'application/json'});
              console.log("executing finally return");
              console.log(rooms_with_names);
              res.end(JSON.stringify(rooms_with_names));
      }
      
      var query = {$or: [{userId1: { $eq : userId }}, {userId2: { $eq : userId }}]};
      
      read_all_rooms(collection, query, processRooms);
  });
  
  function populateNames(room, userId, cb) {
      var chatteeId;
      if (userId.equals(room.userId1)) {
          chatteeId = room.userId2;
      } else {
          chatteeId = room.userId1;
      }
      
      var otherName;
      
      db.collection("users").findOne({
            _id: { $eq : chatteeId }}, (err,result) => {
                console.log("USER NAME: " + result.name);
                
                var chatRoomObj = {
                      chatRoomId: room._id,
                      currentUserId: userId,
                      chatteeId: chatteeId,
                      chatteeName: result.name,
                      chatteePhoto: result.photo
                  }
                  
                cb(chatRoomObj);
      });
  }
});

function get_chat_rooms(cb) {
    var chat_rooms = db.collection("chatRooms");
    cb(null, chat_rooms);
}

function read_all_rooms(collection, query, cb) {
    collection.find(query, cb);
}

app.post('/create_message', jsonParser, (req, res) => {
    console.log("create_message");
    console.log(req.body);
    
    var chatRoomId = req.body.chatRoomId;
    req.body['date'] = new Date(Date.now()).toISOString();
    req.body.senderId = getOIdFromUserId(req.body.senderId);
    req.body.receiverId = getOIdFromUserId(req.body.receiverId);
    req.body.chatRoomId = getOIdFromUserId(req.body.chatRoomId);
    db.collection("messages").insertOne(req.body, (err, result) => {
        db.collection("users").find({$or:[{ _id : { $eq : req.body.receiverId } }, { _id : { $eq : req.body.senderId } }]}).toArray((err, result) => {
          console.log(result);
          var receiver;
          var sender;
          if(result[0]._id.equals(req.body.receiverId))
          {
              receiver = result[0];
              sender = result[1];
          }
          else
          {
              receiver = result[1];
              sender = result[0];
          }
          var registrationToken = receiver.fcmToken;
          var notificationBody = req.body.content;
          var message = {
            data: { title : 'New Message from: ' + sender.name, 
                            body : notificationBody, 
                            type: "message", 
                            chatRoomId: chatRoomId},
            token: registrationToken,
          }
          var notification = {
            notification: { title : 'New Message from: ' + sender.name, 
                            body : notificationBody},
            token: registrationToken,
          }

          admin.messaging().send(message)
          .then((response) => {
                // Response is a message ID string.
                console.log('Successfully sent message:', response);
              })
              .catch((error) => {
                console.log('Error sending message:', error);
              });
              
          admin.messaging().send(notification)
          .then((response) => {
                // Response is a message ID string.
                console.log('Successfully sent notification:', response);
              })
              .catch((error) => {
                console.log('Error sending messanotificationge:', error);
              });
        });
      if (err) {
            res.sendStatus(400);
      }
      else 
      {
        res.writeHead(201, {'Content-Type': 'application/json'});
        var messageObjId = {
          messageId: result.insertedId
        }
        res.end(JSON.stringify(messageObjId));
      }
    });
});

app.post('/get_messages_by_chatroom_id', jsonParser, (req, res) => {
    console.log("get_messages_by_chatroom_id");
    console.log(req.query);
  
  var request_body = {};
  var chatRoomId = getOIdFromUserId(req.query.chatRoomId);
  request_body['chatRoomId'] = chatRoomId;
  
  //https://stackoverflow.com/questions/13847766/how-to-sort-a-collection-by-date-in-mongodb
  db.collection("messages").find(request_body)
  .sort({date: 1})
  .toArray((err,result) => {
    if(err){
      res.sendStatus(400);
    }
    else{
       res.writeHead(200, {'Content-Type': 'application/json'});
       var messages = getMessagesWithNames(result);
       res.end(JSON.stringify(messages));
    }
  });
});

function getMessagesWithNames(result) {
  var messages = [];
  result.forEach(function(message){
      var messageObj = {
          messageId: message._id,
          senderId: message.senderId,
          receiverId: message.receiverId,
          content: message.content,
          date: message.date,
      }
      messages.push(messageObj);
  });
  return messages;
}

var server = app.listen(constants.PORT_NUM, ()=> {
  console.log(server.address());
});
