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

function get_chat_rooms(cb) {
    var chat_rooms = db.collection("chatRooms");
    cb(null, chat_rooms);
}

function read_all_rooms(collection, query, cb) {
    collection.find(query, cb);
}

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

router.post('/get_chat_room_by_user_ids', jsonParser, (req, res) => {
    //console.log("get_chat_room_by_user_ids");
    //console.log(req.body);

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

router.post('/create_chat_room', jsonParser, (req, res) => {
    //console.log("create_chat_room");
    //console.log(req.body);

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

router.post('/get_chat_rooms_by_user_id', jsonParser, (req, res) => {
    //console.log("get_chat_rooms_by_user_id");
    //console.log(req.body);
  var numberOfRooms = 0;
  var count = 0;
  var rooms_with_names = [];

  var userId = getOIdFromUserId(req.body.userId);
  //console.log("USER ID: " + userId);

  get_chat_rooms(function(err, collection) {
      function processRooms(err, rooms) {
          rooms.toArray(function(err, roomsArray) {
              //console.log(roomsArray.length);
              numberOfRooms = roomsArray.length;
              count = 0;
              for(const room of roomsArray) {
                  //console.log(room);

                  populateNames(room, userId, function updateRoomsWithNames(newRoom) {
                      rooms_with_names.push(newRoom);
                      //console.log(rooms_with_names);
                      count++;
                      if (count == numberOfRooms) {
                          finallyReturn();
                      }
                  });

                  //console.log("ROOMS WITH NAMES:");
                  //console.log(rooms_with_names);
              }

          });
      }

      function finallyReturn() {
              res.writeHead(200, {'Content-Type': 'application/json'});
              //console.log("executing finally return");
              //console.log(rooms_with_names);
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
                //console.log("USER NAME: " + result.name);

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

router.post('/create_message', jsonParser, (req, res) => {
    //console.log("create_message");
    //console.log(req.body);

    var chatRoomId = req.body.chatRoomId;
    req.body['date'] = new Date(Date.now()).toISOString();
    req.body.senderId = getOIdFromUserId(req.body.senderId);
    req.body.receiverId = getOIdFromUserId(req.body.receiverId);
    req.body.chatRoomId = getOIdFromUserId(req.body.chatRoomId);
    db.collection("messages").insertOne(req.body, (err, result) => {
        db.collection("users").find({$or:[{ _id : { $eq : req.body.receiverId } }, { _id : { $eq : req.body.senderId } }]}).toArray((err, result) => {
          //console.log(result);
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
                //console.log('Successfully sent message:', response);
              })
              .catch((error) => {
                //console.log('Error sending message:', error);
              });

          admin.messaging().send(notification)
          .then((response) => {
                // Response is a message ID string.
                //console.log('Successfully sent notification:', response);
              })
              .catch((error) => {
                //console.log('Error sending messanotificationge:', error);
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

router.post('/get_messages_by_chatroom_id', jsonParser, (req, res) => {
    //console.log("get_messages_by_chatroom_id");
    //console.log(req.query);

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

module.exports = router;
