var sock 		= require('./socketLayer')

module.exports = function(app, io) {

	//__IMPORT ALL THE CONTROLLERS
	var	main 			= require('../app/controllers/main')
	var	rooms 			= require('../app/controllers/rooms')
	app.get('/*', main.index);

 	sock.get('test', function(data, socket) {
 		console.log('message on server received');
 		console.log(data);
 		socket.emit('testCallback', {success:true});
 	}, io);

 	sock.get('createNewRoom', rooms.createNewRoom, io)

 	app.get('/rooms/:name', rooms.getRoom)
}

