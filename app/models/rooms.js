var mongoose            = require('mongoose')
var roomSchema = new mongoose.Schema({
        url 	: String,
        clients	: []
})
mongoose.model ('Room', roomSchema)