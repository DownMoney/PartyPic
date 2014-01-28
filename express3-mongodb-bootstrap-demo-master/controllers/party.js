var mongoose = require('mongoose')
  
  , Party = mongoose.model('Party');

exports.createParty = function(req, res, next){
	console.log(req.body['loc'][0]);
	point = req.body['loc'].split(',');
	loc = [parseFloat(point[0]), parseFloat(point[1])];
	j = req.body;
	j['loc'] = loc;
	var p = new Party(j);
	p.save(function(e, party){
		if(e)
			console.log(e);
		else
			console.log(party);
	});
} 


exports.getParties = function(req, res, next){
	//point = req.params['loc'].split(',');
	loc = [parseFloat(req.params.lat), parseFloat(req.params.lon)];
  	d = 1000000; //kilometers
  	console.log(loc);
  	Party.find({loc :{$geoWithin:{$center:[loc, d/111.2]}}}).exec(function(err, data){ 
  		if(err)
  			console.log(err);
  		console.log(data);
    	res.json({'parties':data});
  	});
}