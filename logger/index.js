'use strict';
const Mongo = require('mongodb').MongoClient;
const config = require('../config');
let db;
Mongo.connect(config.MONGO_URI,function(err,database){
  db = database;
})
module.exports = (obj)=>{
  db.collection('VanillaMessanger_logs')
    .insert(obj,(error,result)=>{
      if(error) console.log(error);
    });
}
