var mongoose = require('mongoose')
  , Picture = mongoose.model('Picture');

exports.upload = function(req, res, next){
	var pic = new Picture(req.body);
	pic.save(function(err, data){
		if(err)
			console.log(err);

		console.log(data);
		res.json({'response': 'OK'});
	});
} 
