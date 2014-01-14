var AWS = require('aws-sdk'); 

AWS.config.loadFromPath('./config.json');

var s3 = new AWS.S3(); 

function getFiles(party,fn){
	s3.client.listObjects({"Bucket":"partypic", "Prefix":party+"/"}, function(err, data){	
	fn(err, data);
});
}

//register user

function registerUser(params){

}

//add party

function addParty(params){

}

//upload pic

function uploadPic(params){

}


var io = require('socket.io').listen(8080);

io.sockets.on('connection', function (socket) {
	setInterval(function(){
		getFiles('michael',function(e,d){
	  	 socket.emit('refresh', {files:d});
	  });
	}, 1000);
  
 
});


var express  = require('express');
var app      = express(); 	
app.configure(function() {
		app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
		app.use(express.logger('dev')); 						// log every request to the console
		app.use(express.bodyParser()); 							// pull information from html in POST
		app.use(express.methodOverride()); 						// simulate DELETE and PUT
	});



app.get('/api/party/:party', function(req, res) {

		getFiles(req.params.party, function(err, data){
			res.json(data);
		});
		
	});

app.get('/', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});

	// listen (start app with node server.js) ======================================
	app.listen(8081);
	console.log("App listening on port 8081");

