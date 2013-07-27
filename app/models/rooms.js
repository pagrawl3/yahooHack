var mongoose	= require('mongoose')
var roomSchema = new mongoose.Schema({
        room_name 	: String,
        url			: String,
        files 		: []
})
mongoose.model ('Room', roomSchema)