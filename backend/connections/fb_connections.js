const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require("../firebase.json");
var constants = require("../constants");

function init(callback){
  if(!admin.apps.length){
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: constants.FIREBASE_DB_URL
    });
  }
  callback();
}

function get(){
  return admin;
}

module.exports = {
   init,
   get,
};
