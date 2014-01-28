var mongoose = require('mongoose')
  , Schema = mongoose.Schema;


var partySchema = new Schema({
	name : String,
	loc: { type: {}, index: '2dsphere', sparse: true },
	people: [],
	ownerID: String
});

module.exports = mongoose.model('Party', partySchema);