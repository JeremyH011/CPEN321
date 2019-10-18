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

app.get('/get_listings', (req, res) => {
	db.collection("listings").find().toArray((err,result) => {
		res.send(result);
	});
});

app.post('/create_listing', jsonParser, (req,res)=>{
	console.log("Create listing\n");
	console.log(req.body);
	db.collection("listings").insertOne(req.body, (err, result) => {
        let Pusher = require('pusher');
        let channels_client = new Pusher({
                    appId: process.env.PUSHER_APP_ID,
                    key: process.env.PUSHER_APP_KEY,
                    secret: process.env.PUSHER_APP_SECRET,
                    cluster: process.env.PUSHER_APP_CLUSTER
        });

        pusher.trigger('rent-easy-channel', 'listing-added', {"message": "hello world"}, req.headers['x-socket-id']);
		res.send("Saved");
	});
});

var server = app.listen(1337, ()=> {
	var host = server.address().address
	var port = server.address().port
	console.log("Server running at http://%s:%d", host, port)
});
