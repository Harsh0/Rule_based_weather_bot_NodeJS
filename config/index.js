'use strict';

if(process.env.NODE_ENV==='production'){
  module.exports={
    PAGE_ACCESS_TOKEN:process.env.PAGE_ACCESS_TOKEN,//token generated from developer.facebook.com
    VERIFY_TOKEN:process.env.VERIFY_TOKEN,//randomly generated token for page authenticated, to be added as a webhook
    APP_SECRET:process.env.APP_SECRET
  }
}else{
  module.exports = require('./development.json');
}
