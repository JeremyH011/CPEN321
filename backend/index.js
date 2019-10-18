const express = require('express');
const app = express();
const mongoclient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

var jsonParser = bodyParser.json();

mongoclient.connect("mongodb://0.0.0.0:27017",(err,client)=> {db = client.db('redb')});

app.post('/sign_up', jsonParser, (req,res) => {
	console.log("Sign up");
	db.collection("users").insertOne(req.body, (err, result) => {
		if(err){
			res.sendStatus(400);
		} else {
			res.sendStatus(200);
		}
	});
});

app.get('/login', (req,res) => {
	console.log("Enter login endpoint.");
	console.log(req.query.id);
	console.log(req.query.password);
	db.collection("users").find({"user_id":req.query.id, "password":req.query.password}, (err, result) => {
		if(err){
			res.sendStatus(400);
		}
		if(result){
			res.sendStatus(200);
		}
		else{
			res.sendStatus(401);
		}
	});
});

app.get('/', (req,res) => {
	console.log("Testing");
	res.send("Hello World")
});

app.get('/get_listing', (req, res) => {
	db.collection("listings").find({_id: req.query.id}).toArray((err, result) => {
		if(err){
			res.sendStatus(400);
		}
		else{
			res.send(result);
		}
	});
});

app.get('/get_all_listings', (req, res) => {
	db.collection("listings").find().toArray((err,result) => {
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

var server = app.listen(1337, ()=> {
	var host = server.address().address
	var port = server.address().port
	console.log("Server running at http://%s:%d", host, port)
});
