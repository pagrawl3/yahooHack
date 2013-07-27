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

 	app.get('/rooms/:name', rooms.getRoom)
	app.get('/*', main.index);
}


