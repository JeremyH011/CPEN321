var express = require('express');
const bodyParser = require('body-parser');
var router = express.Router();

var jsonParser = bodyParser.json();
router.use(bodyParser.json());

var db_con = require('../connections/db_connections');
var db;
db_con.connect(() => {
    db = db_con.get();
});

var fs_con = require('../connections/storage.js');
var upload;
fs_con.init(() => {
  upload = fs_con.get();
});

var fb_con = require('../connections/fb_connections');
var admin;
fb_con.init(()=>{
  admin = fb_con.get();
});

function getOIdFromUserId(userId){
  var mongo = require('mongodb');
  //console.log(userId);
  return new mongo.ObjectID(userId);
}

router.get('/get_listings', jsonParser, (req, res) => {
  //console.log("GETTING LISTING WITH QUERY: ");
  //console.log(req.body);
  db.collection("listings").find(req.body).toArray((err,result) => {
    res.send(result);
  });
});

router.get('/get_listing_by_id', jsonParser, (req, res) => {
  //console.log(req.query);

  var o_id = getOIdFromUserId(req.query.userId);

  db.collection("listings").find({_id: { $eq : o_id },}).toArray((err,result) => {
    if(err){
      res.sendStatus(400);
    }
    else{
      res.send(result);
    }
  });
});

router.post('/get_listings_by_userId', jsonParser, (req, res) => {
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

router.post('/delete_listing', jsonParser, (req, res) => {
  //console.log(req.body);

  try{
    var o_id = getOIdFromUserId(req.body.listingId);

    db.collection("listings").remove({_id: { $eq : o_id },}, (err, result)=>{
      if(err){
        res.sendStatus(401);
      }
      res.sendStatus(200);
    });
  }catch{
    res.sendStatus(401);
  }
});

router.post('/create_listing', upload.array('photo[]', 99), jsonParser, (req,res)=>{
  req.body['date'] = new Date(Date.now()).toISOString();
  //console.log(req.body);
  var request_body = req.body;
  request_body['latitude'] = parseFloat(req.body.latitude);
  request_body['longitude'] = parseFloat(req.body.longitude);
  request_body['price'] = parseFloat(req.body.price);
  request_body['numBeds'] = parseInt(req.body.numBeds);
  request_body['numBaths'] = parseInt(req.body.numBaths);
  request_body['photos'] = req.files;
  request_body['userId'] = getOIdFromUserId(req.body.userId);
  request_body['date'] = new Date(Date.now()).toISOString();

  //console.log("Create listing\n");
  //console.log(req.files);
  //console.log(request_body);
  db.collection("listings").insertOne(request_body, (err, result) => {
    res.json({message: 'Saved!'});
    db.collection("users").find({ fcmToken : { $exists : true } }).toArray((err, result) => {
      var registrationTokens = result.map(user => user.fcmToken);
      var notificationBody = req.body.address + "\n$" + req.body.price + "/month\n" + req.body.numBeds + " bedrooms";
      var message = {
        notification: {title : 'New Listing', body : notificationBody},
        tokens: [...new Set(registrationTokens)],
      }

      try{
        admin.messaging().sendMulticast(message)
        .then((response) => {
          if (response.failureCount > 0) {
            const failedTokens = [];
            response.responses.forEach((resp, idx) => {
              if (!resp.success) {
                failedTokens.push(registrationTokens[idx]);
              }
            });
            //console.log('List of tokens that caused failures: ' + failedTokens);
          }
        });
      } catch(e){
        return;
      }
    });
  });
});

module.exports = router;
