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

function getOIdFromUserId(userId){
  var mongo = require('mongodb');
  //console.log(userId);
  return new mongo.ObjectID(userId);
}

router.post('/signup', upload.array('photo', 99), jsonParser, (req,res) => {
  req.body['date'] = new Date(Date.now()).toISOString();
  //console.log(req.body);
  var request_body = req.body;
  db.collection("users").find({"email":req.body.email}).count(function (err, count){
    if(err) {
      res.sendStatus(400);
    }
    else{
      if (count == 0) {
        request_body['age'] = parseInt(req.body.age);
        request_body['photo'] = req.files;
        //console.log(request_body);
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

router.post('/add_user_fcm_token', jsonParser, (req,res) => {
  //console.log("ADDING TOKEN " + req.body.token + " for user " + req.body.userId);

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

router.post('/get_user_by_id', jsonParser, (req, res) => {
  //console.log(req.body);

  var o_id = getOIdFromUserId(req.body.userId);

  db.collection("users").find({
    _id: { $eq : o_id },
  }).toArray((err,result) => {
    if(err){
      res.sendStatus(400);
    }
    else{
      //console.log(result);
      res.send(result);
    }
  });
});

router.post('/update_user_data', jsonParser, (req,res) => {
  //console.log("UPDATING USER DATA FOR USER " + req.body.userId);

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
            //console.log(req.body);
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
                //console.log(req.body);
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

router.post('/update_user_photo', upload.array('photo', 99), jsonParser, (req,res) => {
  //console.log("UPDATING USER PHOTO FOR USER " + req.body.userId);

  var o_id = getOIdFromUserId(req.body.userId);
  var request_body = req.body;
  request_body['photo'] = req.files;
  //console.log("request body ", request_body);

  db.collection("users").updateOne({_id : o_id}, {$set: { photo: request_body['photo'] }}, function(err,result){
    if(err){
      res.sendStatus(400);
    }
    else{
      //console.log("req.body ", req.body);
      res.sendStatus(200);
    }
  });
});

module.exports = router;
