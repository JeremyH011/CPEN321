const express = require('express');
const app = express();
const mongoclient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const geolib = require('geolib');
const admin = require('firebase-admin');
const serviceAccount = require("./firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://crafty-fulcrum-255723.firebaseio.com"
});

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

app.post('/login', jsonParser, (req,res) => {
	console.log(req.body);
	db.collection("users").find(req.body).toArray(function (err, result){
		console.log(result);
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

app.post('/add_user_fcm_token', jsonParser, (req,res) => {
	console.log("ADDING TOKEN " + req.body.token + " for user " + req.body.userId);

	var mongo = require('mongodb');
        var o_id = new mongo.ObjectID(req.body.userId);

  	db.collection("users").updateOne({_id : o_id}, {$set: {fcmToken : req.body.token}}, function(err,result){
                if(err){
                        res.sendStatus(400);
                }
                else{
                        res.sendStatus(200);
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
		db.collection("users").find({ fcmToken : { $exists : true } }).toArray((err, result) => {
			var registrationTokens = result.map(user => user.fcmToken);
			var notificationBody = req.body.address + "\n$" + req.body.price + "/month\n" + req.body.numBeds + " bedrooms";
			var message = {
				notification: {title : 'New Listing', body : notificationBody},
				tokens: [...new Set(registrationTokens)],
			}

			admin.messaging().sendMulticast(message)
  			.then((response) => {
    				if (response.failureCount > 0) {
      					const failedTokens = [];
     	 				response.responses.forEach((resp, idx) => {
        					if (!resp.success) {
          						failedTokens.push(registrationTokens[idx]);
        					}
      					});
      					console.log('List of tokens that caused failures: ' + failedTokens);
    				}
  			});
		});
		res.send("Saved");
	});
});

const BED_MAX = 5;
const BATH_MAX = 5;
const PRICE_MAX = 5000;
const POI_RANGE_MAX = 20;
const MAX_NUM = 9999999;
const DEFAULT_LAT_DELTA = 0.0622;
const DEFAULT_LONG_DELTA = 0.0421;
const VIEWPORT_BUFFER = 0.005;
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
               numBeds: { $gte: req.body.bedMin, $lte: req.body.bedMax == BED_MAX ? MAX_NUM : req.body.bedMax },
               numBaths: { $gte: req.body.bathMin, $lte: req.body.bathMax == BATH_MAX ? MAX_NUM : req.body.bathMax},
               price: { $gte: req.body.priceMin, $lte: req.body.priceMax == PRICE_MAX ? MAX_NUM : req.body.priceMax },
            } ).toArray((err,result) => {
                if(err){
                    res.sendStatus(400);
                }
                else{
                    // using this geolib library: https://www.npmjs.com/package/geolib
                    // only get listings within desired field if poi range is given
                    
                    var locationFiltered = [];
                    var hasLocationFilter = doesReqHaveLocationFilter(req);
                    if (hasLocationFilter == true) 
                    {
                        locationFiltered = filterForLocations(result, req);
                    }
                    
                    if (locationFiltered.length == 0 && hasLocationFilter == true)
                    {
                        // return default deltas and centered at passed in address since no results found
                        res.send({latitude: req.body.latitude, longitude: req.body.longitude,
                                  latitudeDelta: DEFAULT_LAT_DELTA, longitudeDelta: DEFAULT_LONG_DELTA, numResults: 0});
                    }
                    else
                    {
                        // if there's no location filter then this locationFiltered array was never populated
                        if (hasLocationFilter == false)
                        {
                            locationFiltered = result;
                        }
                        // otherwise, get the bounds of the latitudes and longitudes of the matched listings and return their delta
                        // found that syntax here: https://www.freecodecamp.org/news/15-useful-javascript-examples-of-map-reduce-and-filter-74cbbb5e0a1f/
                        var arrayOfLatLong = locationFiltered.map(function(listing) {
                                              return {latitude: listing.latitude, longitude: listing.longitude};
                                            });
                        var bounds = geolib.getBounds(arrayOfLatLong);
                        var center = geolib.getCenterOfBounds(arrayOfLatLong);
                        res.send({latitude: center.latitude, longitude: center.longitude,
                                  latitudeDelta: bounds.maxLat - bounds.minLat + VIEWPORT_BUFFER, longitudeDelta: bounds.maxLng - bounds.minLng + VIEWPORT_BUFFER, 
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
           numBeds: { $gte: req.body.bedMin, $lte: req.body.bedMax == BED_MAX ? MAX_NUM : req.body.bedMax },
           numBaths: { $gte: req.body.bathMin, $lte: req.body.bathMax == BATH_MAX ? MAX_NUM : req.body.bathMax},
           price: { $gte: req.body.priceMin, $lte: req.body.priceMax == PRICE_MAX ? MAX_NUM : req.body.priceMax },
        } ).toArray((err,result) => {
                if(err){
                    res.sendStatus(400);
                }
                else{
                    // using this geolib library: https://www.npmjs.com/package/geolib
                    // only get listings within desired field if poi range is given
                    var locationFiltered = [];
                    var hasLocationFilter = doesReqHaveLocationFilter(req);
                    if (hasLocationFilter == true) 
                    {
                        locationFiltered = filterForLocations(result, req);
                    }
                    else // if there's no location filter then this locationFiltered array should just be the result
                    {
                        locationFiltered = result;
                    }
                    
                    res.send(locationFiltered);
                }
        });
});

function doesReqHaveLocationFilter(req) {
    return req.body.poiRangeMax != null && req.body.latitude != null && req.body.longitude != null;
}

// precondition: ONLY CALL IF req.body has a poi range
function filterForLocations(result, req) {
    var locationFiltered = [];
    result.forEach(function(listing){
        if (geolib.isPointWithinRadius(
                          { latitude: listing.latitude, longitude: listing.longitude },
                          { latitude: req.body.latitude, longitude: req.body.longitude },
                            req.body.poiRangeMax == POI_RANGE_MAX ? MAX_NUM : (req.body.poiRangeMax * 1000))) // * 1000 km -> m
        {
            locationFiltered.push(listing);
        }
    });
    return locationFiltered;
}

var server = app.listen(1337, ()=> {
	var host = server.address().address
	var port = server.address().port
	console.log("Server running at http://%s:%d", host, port)
});
