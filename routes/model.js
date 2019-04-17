var mongoose = require("mongoose");
var url = 'mongodb://web:web@localhost:27017/web?authSource=admin'

mongoose.connect(url, {useNewUrlParser: true})

mongoose.connection.on('error', (e) => {
	console.log(e)
})

var vacationSchema = new mongoose.Schema({
	name: String,
	password:String,
	title:String,
	contant:String,
	type:String,
	year:String
});
var Vacation = mongoose.model("vacations",vacationSchema);
module.exports = Vacation;

