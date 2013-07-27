var mongoose = require('mongoose'),
    Room = mongoose.model('Room')

exports.createNewRoom = function (data, socket) {
	console.log('creating new room');
	var newUrl = 'localhost:3000/rooms/'+data.name,
		newRoom = new Room({
			room_name: data.name,
			url : newUrl,
			files : [String]
		});
	newRoom.save(function (err, data) {
		console.log(err, data)
	});
	socket.emit('createNewRoomSuccess', {url : newUrl})
}

exports.getRoom = function (req, res) {
	var roomName = req.params.name;
	Room.find({room_name: roomName}, function (err, docs) {
		res.render('rooms', {room : docs[0].name, url : docs[0].url})
	})
}