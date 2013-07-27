var sock 		= require('./socketLayer')

module.exports = function(app, io) {

	//__IMPORT ALL THE CONTROLLERS
	var	main 			= require('../app/controllers/main')
	var	rooms 			= require('../app/controllers/rooms')

 	sock.get('test', function(data, socket) {
 		console.log('message on server received');
 		console.log(data);
 		socket.emit('testCallback', {success:true});
 	}, io);

 	sock.get('createNewRoom', rooms.createNewRoom, io)
 	sock.get('embedSong', rooms.embedSong, io)
 	sock.get('startPlay', rooms.startPlay, io)

 	app.get('/rooms/:roomId', rooms.getRoom)
 	// app.get('/rooms/:roomId', function(req, res) {
 	// 	console.log(req.params.roomId);
 	// 	res.render('index');
 	// })
	app.get('/*', main.index);
}


