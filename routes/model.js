var mongoose = require("mongoose");
var vacationSchema = mongoose.Schema({
	name: String,
	password:String,
	title:String,
	contant:String,
	type:String,
	year:String
});
var Vacation = mongoose.model("vacations",vacationSchema);
module.exports = Vacation;

