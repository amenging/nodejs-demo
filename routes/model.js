var mongoose = require("mongoose");
var vacationSchema = mongoose.Schema({
	name: String,
	password:String
});
var Vacation = mongoose.model("vacations",vacationSchema);
module.exports = Vacation;

