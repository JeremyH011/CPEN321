const express = require('express');
const app = express();
const mongoclient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const geolib = require('geolib');

var jsonParser = bodyParser.json();

mongoclient.connect("mongodb://0.0.0.0:27017",(err,client)=> {db = client.db('redb')});

app.post('/signup', jsonParser, (req,res) => {
	console.log(req.body);
	db.collection("users").find({"email":req.body.email}).count(function (err, count){
		if(err) {
			res.sendStatus(400);
		}
		else{
			if (count == 0) {
				db.collection("users").insertOne(req.body, (err, result) => {
					if(err) {
						res.sendStatus(400);
					} else {
						res.sendStatus(201);
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
	db.collection("users").find(req.body).count(function (err, count){
		console.log(count);
		if(err) {
			res.sendStatus(400);
		} else if (count > 0) {
			res.sendStatus(201);
		} else {
			res.sendStatus(401);
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

	var mongo = require('mongodb');
	var o_id = new mongo.ObjectID(req.body._id);

  db.collection("listings").find(o_id).toArray((err,result) => {
		if(err){
			res.sendStatus(400);
		}
		else{
			res.send(result);
		}
	});
});

app.post('/create_listing', jsonParser, (req,res)=>{
	console.log("Create listing\n");
	console.log(req.body);
	db.collection("listings").insertOne(req.body, (err, result) => {
		res.send("Saved");
	});
});

const bedMax = 5;
const bathMax = 5;
const priceMax = 5000;
const poiRangeMax = 20;
const MAX_NUM = 9999999;
app.post('/save_search_history', jsonParser, (req,res)=>{
	console.log("Save Search History\n");
	console.log(req.body);
	db.collection("searchHistory").insertOne(req.body, (err, result) => {
        
        if(err)
        {
            res.sendStatus(400);
        }
        else
        {
            // get all listings that match the criteria
            db.collection("listings").find( {
               numBeds: { $gte: req.body.bedMin, $lte: req.body.bedMax == bedMax ? MAX_NUM : req.body.bedMax },
               numBaths: { $gte: req.body.bathMin, $lte: req.body.bathMax == bathMax ? MAX_NUM : req.body.bathMax},
               price: { $gte: req.body.priceMin, $lte: req.body.priceMax == priceMax ? MAX_NUM : req.body.priceMax },
            } ).toArray((err,result) => {
                if(err){
                    res.sendStatus(400);
                }
                else{
                    // using this geolib library: https://www.npmjs.com/package/geolib
                    // only get listings within desired field if poi range is given
                    
                    var locationFiltered = [];
                    var hasLocationFilter = false;
                    if (req.body.poiRangeMax != null && req.body.latitude != null && req.body.longitude != null) 
                    {
                        hasLocationFilter = true;
                        result.forEach(function(listing){
                            if (geolib.isPointWithinRadius(
                                              { latitude: listing.latitude, longitude: listing.longitude },
                                              { latitude: req.body.latitude, longitude: req.body.longitude },
                                                req.body.poiRangeMax == poiRangeMax ? MAX_NUM : (req.body.poiRangeMax * 1000)))
                            {
                                locationFiltered.push(listing);
                            }
                        });
                    }
                    
                    if (locationFiltered.length == 0 && hasLocationFilter == true)
                    {
                        // return no deltas is no results found
                        res.send({latitude: req.body.latitude, longitude: req.body.longitude,
                                  latitudeDelta: 0.0622, longitudeDelta: 0.0421, numResults: 0});
                    }
                    else
                    {
                        // if there's no location filter then this locationFiltered array was never populated
                        if (hasLocationFilter == false)
                        {
                            locationFiltered = result;
                        }
                        console.log("LINE 150");
                        // otherwise, get the bounds of the latitudes and longitudes of the matched listings and return their delta
                        // found that syntax here: https://www.freecodecamp.org/news/15-useful-javascript-examples-of-map-reduce-and-filter-74cbbb5e0a1f/
                        var arrayOfLatLong = locationFiltered.map(function(listing) {
                                              return {latitude: listing.latitude, longitude: listing.longitude};
                                            });
                        var bounds = geolib.getBounds(arrayOfLatLong);
                        var center = geolib.getCenterOfBounds(arrayOfLatLong);
                        res.send({latitude: center.latitude, longitude: center.longitude,
                                  latitudeDelta: bounds.maxLat - bounds.minLat + 0.005, longitudeDelta: bounds.maxLng - bounds.minLng + 0.005, 
                                  numResults: locationFiltered.length});
                    }
                }
            });
        } 
	});
});

app.post('/get_listings_by_filter', jsonParser, (req, res) => {
    console.log("GET LISTINGS BY FILTER");
	console.log(req.body);

        // get all listings that match the criteria
        db.collection("listings").find( {
           numBeds: { $gte: req.body.bedMin, $lte: req.body.bedMax == bedMax ? MAX_NUM : req.body.bedMax },
           numBaths: { $gte: req.body.bathMin, $lte: req.body.bathMax == bathMax ? MAX_NUM : req.body.bathMax},
           price: { $gte: req.body.priceMin, $lte: req.body.priceMax == priceMax ? MAX_NUM : req.body.priceMax },
        } ).toArray((err,result) => {
                if(err){
                    res.sendStatus(400);
                }
                else{
                    // using this geolib library: https://www.npmjs.com/package/geolib
                    // only get listings within desired field if poi range is given
                    var locationFiltered = [];
                    var hasLocationFilter = false;
                    if (req.body.poiRangeMax != null && req.body.latitude != null && req.body.longitude != null) 
                    {
                        hasLocationFilter = true;
                        result.forEach(function(listing){
                            if (geolib.isPointWithinRadius(
                                              { latitude: listing.latitude, longitude: listing.longitude },
                                              { latitude: req.body.latitude, longitude: req.body.longitude },
                                                req.body.poiRangeMax == poiRangeMax ? MAX_NUM : (req.body.poiRangeMax * 1000)))
                            {
                                locationFiltered.push(listing);
                            }
                        });
                    }
                    
                    // if there's no location filter then this locationFiltered array was never populated
                    if (hasLocationFilter == false)
                    {
                        locationFiltered = result;
                    }
                    
                    res.send(locationFiltered);
                }
        });
});

var server = app.listen(1337, ()=> {
	var host = server.address().address
	var port = server.address().port
	console.log("Server running at http://%s:%d", host, port)
});
