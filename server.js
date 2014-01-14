var AWS = require('aws-sdk'); 

AWS.config.loadFromPath('./config.json');

var s3 = new AWS.S3(); 

function getFiles(party,fn){
	s3.client.listObjects({"Bucket":"partypic", "Prefix":party+"/"}, function(err, data){	
	fn(err, data);
});
}



var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/pp');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function callback () {
  // yay!

  console.log('OK!');
});

//register user

function registerUser(params){

}

//add party

function addParty(params){

}

//upload pic

function uploadPic(params){

}


var express  = require('express');
var app      = express(); 	
var engine = require('ejs-locals');
var path = require('path');
var User = require('./models/user');


app.engine('ejs', engine);
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());

app.use(express.methodOverride());
app.use(express.cookieParser('haha this is a very funny secret'));
app.use(express.session());

app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

app.get('/api/party/:party', function(req, res) {

		getFiles(req.params.party, function(err, data){
			res.json(data);
		});
		
	});

app.get('/party/:party', function(req, res) {
		res.render('party', {party: req.params.party, title: "Michael's Party"}); // load the single view file (angular will handle the page changes on the front-end)
	});

	// listen (start app with node server.js) ======================================
	app.listen(3000);
	console.log("App listening on port 3000");

