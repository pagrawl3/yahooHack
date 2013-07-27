$(document).ready(function() {
	//JSLint told me to put for some ECMAScript5 optimizations
	"use strict";

	filepicker.setKey('AKuopPE6CTw0vqFI3RA7Az');

	function bindRoomListeners () {
		$('#upload').click(function() {
			console.log('here')
			filepicker.pickAndStore({},{},function(data){
			   console.log(JSON.stringify(data));
			   $('#url').html(data[0].url);
			   // $('#url').html(data[0].url)
			   var roomName = window.roomName;
			   console.log(roomName)
			   socket.emit('embedSong', {data: data[0], roomName: roomName});
			});
		});
	}

	
	$('#createRoom').click(function() {
		console.log($('#roomNum').val());
		socket.emit('createNewRoom', {name: $('#roomNum').val()});
	});


	//Establish a socket conenction with the server for future stuff
	var socket = io.connect('/');
	socket.emit('test',{success: true});
	socket.on('testCallback', function(data) {
		console.log('client side test successful');
	});

	socket.on('createNewRoomSuccess', function (data) {
		window.roomName = data.name;
		console.log(data);
		$('#wrapper').replaceWith(data.html);
		bindRoomListeners();
	});

	socket.on('embedSongSuccess', function (data) {
		var player = $('<audio controls></audio>')
		player.on('ended', function () {
			this.remove();
			socket.emit('pop', {roomName: window.roomName})
		});
		player.attr('src', data.url).hide();
		$('#queue').append($('<div></div>').append(player));
		player.fadeIn(800);
	});

	socket.on('popSuccess', function (data) {
		console.log(data)
	})

	socket.on('play', function () {

	})

});