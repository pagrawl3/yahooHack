var mongoose = require('mongoose'),
    Room = mongoose.model('Room'),
    fs 			= require('fs'),
	jade 		= require('jade')

exports.createNewRoom = function (data, socket) {
	console.log('creating new room');
	var newUrl = 'localhost:3000/rooms/'+data.name,
		newRoom = new Room({
			room_name: data.name,
			url : newUrl,
			files : [String]
		});
	newRoom.save(function (err, data2) {
		console.log(err, data)
		var pathToTemplate = require('path').resolve(__dirname, '../views') + '/rooms_partial.jade';
        var template = fs.readFileSync(pathToTemplate, 'utf8');
        var jadeFn = jade.compile(template, { filename: pathToTemplate, pretty: true });
        var renderedTemplate = jadeFn({room: data.name});
        socket.emit('createNewRoomSuccess', {html : renderedTemplate, url : newUrl})
	});
}

exports.getRoom = function (req, res) {
	var roomName = req.params.name;
	Room.findOne({room_name: roomName}, function (err, docs) {
		res.render('rooms', {name : docs.name, url : docs.url, files : docs.files})
	})
}

exports.embedSong = function (data, socket) {
	Room.findOne({room_name: data.roomName}, function (err, docs) {
		if (!docs.files) {
			docs.files = []
		}
		docs.files.push(data.data.url)
		docs.save(function (err) {
			socket.emit('embedSongSuccess', {success: true, message: 'Song was embedded', url: data.data.url})
		});
	})
}