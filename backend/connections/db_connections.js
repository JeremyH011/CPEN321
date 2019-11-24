const mongoclient = require('mongodb').MongoClient;
var constants = require("../constants");

var db = null;

function connect(callback){
  if(!db){
    console.log(db);
    mongoclient.connect(constants.MONGO_DB_URL, (err,client) => {
      db = client.db(constants.MONGO_DB_NAME);
      return callback();
    });
  }
  else{
    callback();
  }
}

function get(){
   return db;
}

module.exports = {
   connect,
   get,
};
