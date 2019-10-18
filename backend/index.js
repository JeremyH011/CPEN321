const express = require('express');
const app = express();
const mongoclient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const Pusher = require('pusher');

//app.use(express.json);
var constants = require("./touch");

var jsonParser = bodyParser.json();
var channels_client = new Pusher({
     appId: constants.CONST_APP_ID,
     key: constants.CONST_KEY,
     secret: constants.CONST_SECRET,
     cluster: constants.CONST_CLUSTER
});

mongoclient.connect("mongodb://0.0.0.0:27017",(err,client)=> {db = client.db('redb')});

app.get('/', (req,res) => {
	console.log("Testing");
	res.send("Hello World")
});

app.get('/get_listings', (req, res) => {
	db.collection("listings").find().toArray((err,result) => {
		res.send(result);
	});
});

app.post('/create_listing', jsonParser, (req,res)=>{
	console.log("Create listing\n");
	console.log(req.body);
	db.collection("listings").insertOne(req.body, (err, result) => {

        channels_client.trigger('rent-easy-channel', 'listing-added', {"message" : "New listing was just added"}, req.headers['x-socket-id']);
		res.send("Saved");
	});
});

var server = app.listen(1337, ()=> {
	var host = server.address().address
	var port = server.address().port
	console.log("Server running at http://%s:%d", host, port)
});
