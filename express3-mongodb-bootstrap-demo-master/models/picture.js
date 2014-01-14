var mongoose = require('mongoose')
  , Schema = mongoose.Schema;


var pictureSchema = new Schema({
	url : String,
	createdAt : { type: Date, default: Date.now },
	ownerID: String
});

module.exports = mongoose.model('Picture', pictureSchema);