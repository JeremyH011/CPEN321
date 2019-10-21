const express = require('express');
const app = express();
const mongoclient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

//app.use(express.json);

var jsonParser = bodyParser.json();

mongoclient.connect("mongodb://0.0.0.0:27017",(err,client)=> {db = client.db('redb')});

app.get('/', (req,res) => {
	console.log("Testing");
	res.send("Hello World")
});

app.get('/get_listings', jsonParser, (req, res) => {
	console.log("GETTING LISTING WITH QUERY: ");
	console.log(req.body);
	db.collection("listings").find(req.body).toArray((err,result) => {
		console.log("SENT: ")
		console.log(result);
		res.send(result);
	});
});

app.get('/get_listing_by_id', jsonParser, (req, res) => {
	console.log(req.body);

	var mongo = require('mongodb');
	var o_id = new mongo.ObjectID(req.body._id);

		db.collection("listings").find(o_id).toArray((err,result) => {
		res.send(result);
	});
});

app.post('/create_listing', jsonParser, (req,res)=>{
	console.log("Create listing\n");
	console.log(req.body);
	db.collection("listings").insertOne(req.body, (err, result) => {
		res.send("Saved");
	});
});

app.post('/create_account', jsonParser, (req,res)=>{
	console.log("Create User\n");
	console.log(req.body);
	db.collection("users").insertOne(req.body, (err, result) => {
		res.send("Saved");
	});
});

app.get('/get_users', jsonParser, (req, res) => {
	console.log("GETTING USERS WITH QUERY: ");
	console.log(req.query);

	var start = {};
	if(req.query.name){
		start = req.query.name.charAt(0);
		start = `^${start}`;
	}
	db.collection("users").find({"name": {$regex: new RegExp(start, "i")}}).toArray((err,result) => {
		console.log(result);
		res.send(result);
	});
});

app.get('/get_user_account', jsonParser, (req, res) => {
	console.log("GETTING USERS WITH QUERY: ");
	console.log(req.query);

	db.collection("users").find({"email": req.query.email, "password": req.query.password})
	.toArray((err,result) => {
		console.log(result);
		res.send(result);
	});
});

var server = app.listen(1337, ()=> {
	var host = server.address().address
	var port = server.address().port
	console.log("Server running at http://%s:%d", host, port)
});
