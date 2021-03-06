'use strict';
const request = require('request');
const crypto = require('crypto');
class FBeamer {
  constructor(config){
    try{
      if(!config||config.PAGE_ACCESS_TOKEN===undefined||config.VERIFY_TOKEN===undefined){
        throw new Error("Unable to access tokens!");
      }else{
        this.PAGE_ACCESS_TOKEN = config.PAGE_ACCESS_TOKEN;
        this.VERIFY_TOKEN = config.VERIFY_TOKEN;
        this.APP_SECRET = config.APP_SECRET;
      }
    }catch(e){
      console.log(e);
    }
  }
  registerHook(req,res){
    //if req.query.hub.mode is 'subscribe'
    // and if req.query.hub.VERIFY_TOKEN is same as this.VERIFY_TOKEN
    //then send back an HTTP status 200 and req.query.hub.challenge
    let {mode,verify_token,challenge} = req.query.hub;

    if(mode==='subscribe'&&verify_token===this.VERIFY_TOKEN){
      return res.end(challenge);
    }else{
      console.log("could not register webhook!");
      return res.status(403).end();
    }
  }
	verifySignature(req,res,next){
		if(req.method=='POST'){
			let signature = req.headers['x-hub-signature'];
			try{
				if(!signature){
					throw new Error("Signature missing");
				}else{
						let hash = crypto.createHmac('sha1',this.APP_SECRET).update(JSON.stringify(req.body)).digest('hex');
						if(hash!=signature.split("=")[1]){
							throw new Error("Invalid Signature");
						}
				}
			}catch(err){
        //no security
        res.send(200);
        //res.send(500,err);
			}
		}
    return next();
	}
  subscribe(){
    request({
      uri:'https://graph.facebook.com/v2.6/me/subscribed_apps',
      qs:{
        access_token:this.PAGE_ACCESS_TOKEN
      },
      method:'POST'
    },(error,response,body)=>{
      if(!error&&JSON.parse(body).success){
        console.log('Subscribed to the Page');
      }else{
        console.log(error||JSON.parse(body).error);
      }
    })
  }

  incoming(req,res,cb){
    //Extract the body of the Post request
    let data = req.body;
    //console.log(JSON.stringify(data));
    if(data.object==='page'){
      data.entry.forEach(pageObj=>{
        //iterate through the messaging array
        pageObj.messaging.forEach(msgEvent=>{
          let messageObj = {
            sender:msgEvent.sender.id,
            timeOfMessage :msgEvent.timestamp,
            message:msgEvent.message
          };
          cb(messageObj);
        });
      });
    }
    res.send(200);
  }
  sendMessage(payload){
    return new Promise((resolve,reject)=>{
      //create an HTTP POST request
      request({
        uri:'https://graph.facebook.com/v2.6/me/messages',
        qs:{
          access_token:this.PAGE_ACCESS_TOKEN
        },
        method:'POST',
        json:payload
      },(error,response,body)=>{
          if(!error && response.statusCode===200){
            resolve({
              messageId:body.message_id
            })
          }else{
            console.log(error);
            reject(error)
          }
      });
    });
  }
  // Send a txt message
  txt(id,text){
    let obj = {
      recipient:{
        id
      },
      message:{
        text
      }
    }
    this.sendMessage(obj)
      .catch(error=>console.log(error));
  }
  //Send an image message
  img(id,url){
    let obj= {
      recipient:{
        id
      },
      message:{
        attachment:{
          type:'image',
          payload:{
            url
          }
        }
      }
    }
    this.sendMessage(obj)
      .catch(error=>console.log(error))
  }
}

module.exports = FBeamer
