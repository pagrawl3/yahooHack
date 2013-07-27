$(document).ready(function() {
	//JSLint told me to put for some ECMAScript5 optimizations
	"use strict";

	filepicker.setKey('AKuopPE6CTw0vqFI3RA7Az');

	$('#upload').click(function() {
		console.log('here')
		filepicker.pickAndStore({},{},function(data){
		   console.log(JSON.stringify(data));
		   $('#url').html(data[0].url);
		});
	})

	$('#createRoom').click(function() {
		socket.emit('createNewRoom', $('#roomNum').val());
	})

	//Establish a socket conenction with the server for future stuff
	var socket = io.connect('/');
	socket.emit('test',{success: true});
	socket.on('testCallback', function(data) {
		console.log('client side test successful');
	});

	socket.on('createNewRoomSuccess', function (data) {
		window.roomName = data.name;
		console.log(data)
	})

})