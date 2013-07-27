var mongoose	= require('mongoose')
var roomSchema = new mongoose.Schema({
        room_name 	: String,
        url			: String,
        files 		: [String]
})
mongoose.model ('Room', roomSchema)