const express = require('express');
const multer = require('multer');

let Storage;
let upload;

function init(callback){
  Storage = multer.diskStorage({
    destination(req, file, callback) {
      callback(null, '../public/images')
    },
    filename(req, file, callback) {
      callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`)
    },
  });

  upload = multer({ storage: Storage });
  callback();
}

function get(){
  return upload
}

module.exports = {
   init,
   get,
};
