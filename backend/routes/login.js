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

router.post('/login', jsonParser, (req,res) => {
  //console.log(req.body);
  db.collection("users").find(req.body).toArray(function (err, result){
    //console.log(result);
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

module.exports = router;
