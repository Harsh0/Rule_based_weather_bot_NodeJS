'use strict';
//create and API server\
const fs = require('fs');
const Restify = require('restify');
const server = Restify.createServer({
  name:'VanillaMessanger'
})
const PORT = process.env.PORT ||8080;

server.use(Restify.jsonp());
server.use(Restify.bodyParser());
server.use((req,res,next)=>f.verifySignature(req,res,next));

//Token
const config = require('./config');

//FBeamer
const FBeamer = require('./fbeamer');
const f = new FBeamer(config);

//Vanilla
const matcher = require('./matcher');
const weather = require('./weather');
const {currentWeather,forecastWeather} = require('./parser');

//Register the webhooks
server.get('/',(req,res,next)=>{
  f.registerHook(req,res);
  console.log('webhook registered');
  return next();
})

//Receiving post request
server.post('/',(req,res,next)=>{
  f.incoming(req,res,msg=>{
    //Process messages
    // f.txt(msg.sender,`Hey you just said ${msg.message.text}`)
    // f.img(msg.sender,"https://avatars1.githubusercontent.com/u/20552536?v=3&s=460");
    if(msg.message.text){
      //If a text message received
      console.log(msg.message.text);
      matcher(msg.message.text,data=>{
        switch(data.intent){
          case 'Hello':
            f.txt(msg.sender,`${data.entities.greeting} to you too`);
            break;
          case 'Exit':
            f.txt(msg.sender,'Have a great day!');
            break;
          case 'CurrentWeather':
            f.txt(msg.sender,"Let me check....");
            //  get the weather data from API
            weather(data.entities.city,'current')
              .then(response=>{
                let parseResult = currentWeather(response);
                f.txt(msg.sender,parseResult);
              })
              .catch(err=>{
                console.log(err);
                console.log('There seem to be a problem connecting to weather service!');
                f.txt(msg.sender,'Hmm, something\'s not right with my servers! Do check back in a while');
              });
            break;
        case 'WeatherForecast':
          f.txt(msg.sender,"Let me check....");
          //  get the weather data from API
          weather(data.entities.city,'forecast')
            .then(response=>{
              let parseResult = forecastWeather(response,data.entities);
              f.txt(msg.sender,parseResult);
            })
            .catch(err=>{
              console.log(err);
              console.log('There seem to be a problem connecting to weather service!');
              f.txt(msg.sender,'Hmm, something\'s not right with my servers! Do check back in a while');
            });
          break;
          default:{
            f.txt(msg.sender,"Gosh! I dont know, what you mean :(");
          }
        }
      });
    }
  });
  return next();
});

server.get('/privacypolicy',(req,res,next)=>{
  var rs = fs.createReadStream('Privacy_Policy.html');
	res.writeHead(200,{'Content-Type':'text/html'});
  rs.pipe(res);
});

//Subscribe
f.subscribe();

server.listen(PORT,()=> console.log(`Vanilla running on port ${PORT}`));
