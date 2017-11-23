var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var calendarSchema = new Schema({
    title: String,
    start: String, 
	end: String, 
	descr: String, 
	color: String, 
	id: String,   
	allday: String, 
    reg_dt: { type: Date, default: Date.now  }
});

module.exports = mongoose.model('calendar', calendarSchema);
