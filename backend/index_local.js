const express = require('express');
const mongoclient = require('mongodb').MongoClient;
const multer = require('multer')
const bodyParser = require('body-parser');
const geolib = require('geolib');

const app = express();
var jsonParser = bodyParser.json();
app.use(bodyParser.json())

mongoclient.connect("mongodb://0.0.0.0:27017",(err,client)=> {db = client.db('redb')});

const local_hostname = '192.168.1.76';
app.use('/public/images', express.static('public/images'));

const Storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, './public/images')
  },
  filename(req, file, callback) {
    callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`)
  },
});

const upload = multer({ storage: Storage });

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

app.post('/create_listing', upload.array('photo[]', 99), jsonParser, (req,res)=>{
  var request_body = req.body;
  request_body['latitude'] = parseFloat(req.body.latitude);
  request_body['longitude'] = parseFloat(req.body.longitude);
  request_body['price'] = parseFloat(req.body.price);
  request_body['numBeds'] = parseInt(req.body.numBeds);
  request_body['numBaths'] = parseInt(req.body.numBaths);
  request_body['photos'] = req.files;

  console.log("Create listing\n");
  console.log(req.files);
  console.log(request_body);
  db.collection("listings").insertOne(request_body, (err, result) => {
    if(err){
      res.sendStatus(401);
    }
    else{
      res.json(req.files);
    }
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

var server = app.listen(3000, local_hostname, ()=> {
	console.log(server.address());
});
