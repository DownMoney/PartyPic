var AWS = require('aws-sdk'); 

AWS.config.loadFromPath('./config.json');

var s3 = new AWS.S3(); 

function getFiles(party,fn){
  s3.client.listObjects({"Bucket":"partypic", "Prefix":party+"/"}, function(err, data){ 
  fn(err, data);
});
}



// Module Dependencies and Setup

var express = require('express')
  , mongoose = require('mongoose')
  , PartModel = require('./models/party')
  , Party = mongoose.model('Party')
  , party = require('./controllers/party')
  , PictureModel = require('./models/picture')
  , Picture = mongoose.model('Picture')
  , UserModel = require('./models/user')
  , User = mongoose.model('User')
  , picture = require('./controllers/picture')
  , welcome = require('./controllers/welcome')
  , users = require('./controllers/users')
  , http = require('http')
  , path = require('path')
  , engine = require('ejs-locals')
  , flash = require('connect-flash')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , expressValidator = require('express-validator')
  , mailer = require('express-mailer')
  , config = require('./config')
  , app = express();

app.engine('ejs', engine);
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(expressValidator);
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Helpers

app.use(function(req, res, next){
  app.locals.userIsAuthenticated = req.isAuthenticated(); // check for user authentication
  app.locals.user = req.user; // make user available in all views
  app.locals.errorMessages = req.flash('error'); // make error alert messages available in all views
  app.locals.successMessages = req.flash('success'); // make success messages available in all views
  app.locals.layoutPath = "../shared/layout";
  next();
});


// Routing Initializers

app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// Error Handling

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
} else {
  app.use(function(err, req, res, next) {
    res.render('errors/500', { status: 500 });
  });
}

// Database Connection

if ('development' == app.get('env')) {
  mongoose.connect('mongodb://localhost/nodedemo2');
} else {
  // insert db connection for production
}

// Authentication

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({ usernameField: 'email' },
  function(email, password, done) {
    console.log('ssdsddddd');
    User.findOne({ email: email }, function (err, user) {
      if (err) return done(err);
      if (!user) return done(null, false, { message: "Sorry, we don't recognize that username." });
      user.validPassword(password, function(err, isMatch){
        if(err) return done(err);
        if(isMatch) return done(null, user);
        else done(null, false, { message: 'Incorrect password.' });
      });
    });
  }
));

function ensureAuthenticated(req, res, next){
  if (req.isAuthenticated()) return next();
  req.flash('error', 'Please sign in to continue.');
  var postAuthDestination = req.url;
  res.redirect('/login?postAuthDestination='+postAuthDestination);
}

function redirectAuthenticated(req, res, next){
  if (req.isAuthenticated()) return res.redirect('/');
  next();
}

// Routing

app.get('/', welcome.index);
app.get('/login', redirectAuthenticated, users.login);
app.get('/reset_password', redirectAuthenticated, users.reset_password);
app.post('/reset_password', redirectAuthenticated, users.generate_password_reset);
app.get('/password_reset', redirectAuthenticated, users.password_reset);
app.post('/password_reset', redirectAuthenticated, users.process_password_reset);
app.post('/api/login',users.authenticate);
app.get('/register', redirectAuthenticated, users.register);
app.post('/api/register', redirectAuthenticated, users.userValidations, users.create);
app.get('/account', ensureAuthenticated, users.account);
app.post('/account', ensureAuthenticated, users.userValidations, users.update);
app.get('/dashboard', ensureAuthenticated, users.dashboard);
app.get('/logout', users.logout);
app.get('/users',  users.list); // for illustrative purposes only

app.get('/api/party/:party', function(req, res) {

    getFiles(req.params.party, function(err, data){
      res.json(data);
    });
    
  });



app.post('/api/test', function(req, res){
  console.log('HEllo');
  console.log(req.body['password']);
  res.json({"response": "ok"});
});


app.post('/api/picture/upload', ensureAuthenticated, picture.upload);

app.post('/api/party/create', ensureAuthenticated, party.createParty);
app.get('/api/parties/:lat/:lon', ensureAuthenticated, party.getParties);

app.get('/api/party/:party', function(req, res) {
    res.render('party/party', {party: req.params.party, title: "Michael's Party"}); // load the single view file (angular will handle the page changes on the front-end)
  });




app.all('*', welcome.not_found);

// Start Server w/ DB Connection

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  });
});


function uploadPicture(params){

}