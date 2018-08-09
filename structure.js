var mongoose = require('mongoose');
//connection to the database!!!
mongoose.connect('mongodb://localhost:27017/sessionTest', function(err){
	if (err) throw err;
	console.log('successfully connected to the database!!!')
});

var Schema = mongoose.Schema;
var sessionSchema = new Schema({
count:Number,
new_user:String,
new_email:String,
new_pass:String,
conf_pass:String
});
module.exports = mongoose.model('testSession', sessionSchema);
