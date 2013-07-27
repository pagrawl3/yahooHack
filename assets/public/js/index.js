$(document).ready(function() {
	//JSLint told me to put for some ECMAScript5 optimizations
	"use strict";

	filepicker.setKey('AKuopPE6CTw0vqFI3RA7Az');

	window.trigger = 1;
	window.emit = 1;

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
		// $('#upload').hide();
		console.log(data.message)
		console.log(data.metadata)
		console.log(data.player)
		if(data.player) {
		
		$('#player').toggleClass('hidden').attr('src', data.url).on('play', function () {
			if (window.emit) {
				socket.emit('startPlay');
				window.trigger = 0;
			}
			window.emit = 1;
			console.log(this)
			document.getElementById('player').addEventListener('ended', function() {
				socket.emit('pop', {roomName: window.roomName})
			})
		});
		}
		else {
			if(data.metadata !== null) {
				console.log(data.metadata.track.title)
				console.log(data.metadata.track.artist)
			}
		}
	});

	socket.on('popSuccess', function (data) {
		console.log(data)
	})

	socket.on('getAlbumArtSuccess', function (data) {
		console.log(data)
	})

	socket.on('loadingSuccess', function (data) {
		console.log(data)
	})

	socket.on('play', function () {
		if (window.trigger) {
			$('#player').trigger('play');
			window.emit = 0;
		}
		window.trigger = 1;
	})

});