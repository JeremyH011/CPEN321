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

function getOIdFromUserId(userId){
  var mongo = require('mongodb');
  //console.log(userId);
  return new mongo.ObjectID(userId);
}

router.post('/create_review', jsonParser, (req,res) => {
  req.body['date'] = new Date(Date.now()).toISOString();
  //console.log("ADDING REVIEW");
  //console.log(req.body);
  var request_body = req.body;
  request_body['revieweeId'] = getOIdFromUserId(req.body.revieweeId);
  request_body['reviewerId'] = getOIdFromUserId(req.body.reviewerId);
  request_body['reviewerName'] = req.body.reviewerName;
  request_body['revieweeName'] = req.body.revieweeName;
  request_body['relationship'] = req.body.relationship;
  request_body['reviewRating'] = parseInt(req.body.reviewRating);
  request_body['reviewText'] = req.body.reviewText;

  //console.log("Creating review by " + request_body['reviewerId'] + " for " + request_body['revieweeId']);
  //console.log(request_body);
  db.collection("reviews").insertOne(request_body, (err, result) => {
    if (err) {
      res.sendStatus(400);
    } else {
      res.sendStatus(200);
    }
  });
});

router.post('/get_reviews_by_reviewer_id', jsonParser, (req, res) => {
  //console.log(req.body);

  var o_id = getOIdFromUserId(req.body.userId);
  db.collection("reviews").find({
    reviewerId: { $eq : o_id },
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

router.post('/get_reviews_by_reviewee_id', jsonParser, (req, res) => {
  //console.log(req.body);

  var o_id = getOIdFromUserId(req.body.userId);
  db.collection("reviews").find({
    revieweeId: { $eq : o_id },
  }).toArray((err, result) => {
    if(err){
      res.sendStatus(400);
    } else {
      //console.log(result);
      res.send(result);
    }
  });
});

module.exports = router;
