var sock 		= require('./socketLayer')

module.exports = function(app, io) {

	//__IMPORT ALL THE CONTROLLERS
	var	main 			= require('../app/controllers/main')
	app.get('/landing', main.landing);
	app.get('/client', main.client);

	var	rooms 			= require('../app/controllers/rooms')

 	sock.get('test', function(data, socket) {
 		console.log('message on server received');
 		console.log(data);
 		socket.emit('testCallback', {success:true, index: data.index});
 	}, io);

 	sock.get('createNewRoom', rooms.createNewRoom, io)
 	sock.get('embedSong', rooms.embedSong, io)
 	sock.get('startPlay', rooms.startPlay, io)
 	sock.get('pop', rooms.pop, io)

 	app.get('/rooms/:roomId', rooms.getRoom)

	sock.get('test', function(data, socket) {
		console.log('message on server received');
		console.log(data);
		socket.emit('testCallback', {success:true, index: data.index});
	}, io);

	sock.get('audio-time', function(data, socket) {
		console.log(data.data);
		socket.broadcast.emit('time2', {data: data.data, timestamp: data.timestamp});
	}, io)

	app.get('/*', main.index);
	sock.get('test', function(data, socket) {
 		console.log('message on server received');
 		console.log(data);
 		socket.emit('testCallback', {success:true, index: data.index});
 	}, io);

 	sock.get('audio-time', function(data, socket) {
 		console.log(data.data);
 		socket.broadcast.emit('time2', {data: data.data, timestamp: data.timestamp});
 	}, io)

 	sock.get('pause', function(data, socket) {
 		socket.broadcast.emit('pauseBroadcast');
 	}, io)
}


