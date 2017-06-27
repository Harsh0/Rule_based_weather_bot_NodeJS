//Vanilla
const matcher = require('../matcher');
const weather = require('../weather');
const {currentWeather,forecastWeather} = require('../parser');
const logger = require('../logger');
module.exports = (f)=>{
  var responder = (req,res,next)=>{
    f.incoming(req,res,msg=>{
      //Process messages
      // f.txt(msg.sender,`Hey you just said ${msg.message.text}`)
      // f.img(msg.sender,"https://avatars1.githubusercontent.com/u/20552536?v=3&s=460");
      if(msg.message.text){
        //If a text message received
        // console.log(msg.message.text);
        let obj = {'input':msg.message.text,'output':[],'sender':msg.sender};
        matcher(msg.message.text,data=>{
          switch(data.intent){
            case 'Hello':
              obj.output.push(`${data.entities.greeting} to you too`);
              f.txt(msg.sender,obj.output[obj.output.length-1]);
              logger(obj);
              break;
            case 'Exit':
              obj.output.push('Have a great day!');
              f.txt(msg.sender,obj.output[obj.output.length-1]);
              logger(obj);
              break;
            case 'CurrentWeather':
              obj.output.push("Let me check....");
              f.txt(msg.sender,obj.output[obj.output.length-1]);
              //  get the weather data from API
              weather(data.entities.city,'current')
                .then(response=>{
                  let parseResult = currentWeather(response);
                  obj.output.push(parseResult);
                  f.txt(msg.sender,obj.output[obj.output.length-1]);
                  logger(obj);
                })
                .catch(err=>{
                  obj.error = JSON.stringify(err);
                  console.log(obj.error);
                  obj.log = 'There seem to be a problem connecting to weather service!';
                  console.log(obj.log);
                  obj.push('Hmm, something\'s not right with my servers! Do check back in a while');
                  f.txt(msg.sender,obj.output[obj.output.length-1]);
                  logger(obj);
                });
              break;
          case 'WeatherForecast':
            obj.output.push("Let me check....");
            f.txt(msg.sender,obj.output[obj.output.length-1]);
            //  get the weather data from API
            weather(data.entities.city,'forecast')
              .then(response=>{
                let parseResult = forecastWeather(response,data.entities);
                obj.output.push(parseResult);
                f.txt(msg.sender,obj.output[obj.output.length-1]);
                logger(obj);
              })
              .catch(err=>{
                obj.error = JSON.stringify(err);
                console.log(obj.error);
                obj.log = 'There seem to be a problem connecting to weather service!';
                console.log(obj.log);
                obj.push('Hmm, something\'s not right with my servers! Do check back in a while');
                f.txt(msg.sender,obj.output[obj.output.length-1]);
                logger(obj);
              });
            break;
            default:{
              obj.output.push("Gosh! I dont know, what you mean :(");
              f.txt(msg.sender,obj.output[obj.output.length-1]);
              logger(obj);
            }
          }
        });
      }else{

      //  console.log(msg.message.attachments);
        f.txt(msg.sender,"Sorry i dont understand this language! only text");
      }
    });
    return next();
  }
  return responder;
}
