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
const responder = require('./responder')(f);
//Register the webhooks
server.get('/',(req,res,next)=>{
  f.registerHook(req,res);
  console.log('webhook registered');
  return next();
})

//Receiving post request
server.post('/',responder);

server.get('/privacypolicy',(req,res,next)=>{
  var rs = fs.createReadStream('Privacy_Policy.html');
	res.writeHead(200,{'Content-Type':'text/html'});
  rs.pipe(res);
});

//Subscribe
f.subscribe();

server.listen(PORT,()=> console.log(`Vanilla running on port ${PORT}`));
