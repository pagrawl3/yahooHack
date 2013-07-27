var mongoose = require('mongoose'),
    Room = mongoose.model('Room')

exports.createNewRoom = function (data, socket) {
	console.log('creating new room');
	var newRoom = new Room({
		name: data.name,
		url : 'localhost:3000/rooms/'+date.name,
		clients: [socket]
	});
	newRoom.save();
	socket.emit('createNewRoomSuccess', {data: newRoom})
}

exports.getRoom = function (req, res) {
	console.log('room name : ', req.params.name)
}