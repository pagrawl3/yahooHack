$(document).ready(function() {
	//JSLint told me to put for some ECMAScript5 optimizations
	"use strict";

	var socket = io.connect('/');
	window.queue = [];

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
		console.log(new Date().getTime());
		socket.emit('createNewRoom', {name: new Date().getTime()});
	});

	socket.on('createNewRoomSuccess', function (data) {
		window.roomName = data.name;
		$('#wrapper').css('opacity', 0);
		window.setTimeout(function(){
			$('#wrapper').html(data.html);
			$('#wrapper').css('opacity', 1);
			bindRoomListeners();
		},300)
	});
	var start = 0;
	var stop = 0;
	var offset = 0;
	var offsets = [];
	function playPub(player) {
		//Establish a socket conenction with the server for future stuff

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
		var i = 0
		for (i =0; i< 10; i++) {
			window.setTimeout(function(){
				start = window.performance.now();
				socket.emit('test', {success: true});
			},offset);

			if (i = 9)
			 offsetCalibrationCompletePub(player);
		}
		socket.on('testCallback', function(data) {
			stop = window.performance.now();
			offset += (stop - start)/10;
		});
	}

	function offsetCalibrationCompletePub(player) {
		player.trigger('play');
		var bool = false
		player.on('timeupdate', function(data){
			if (!bool) {
				player[0].currentTime += offset;
				bool = true;
			}
			var times = (player[0].currentTime);
			socket.emit('audio-time', {data: times, timestamp: data.timeStamp});
		})

		var once = false;
		
	}
	var once = false;
	function playSub(player) {
		var pubTime = 0;
		var latency = 0;
		socket.on('time2', function(data) {
			pubTime = data.data;
			if (!once) {
				player.trigger('play');
				player[0].currentTime = pubTime;
				once = true;
			}
		})
	}

	if($('#sub')) {
		playSub($('#sub'));
	}

	$('.test-button').on('click', function() {
		once = false;
	});

	socket.on('embedSongSuccess', function (data) {
		queue.push(data);
		var player = $('<audio id="pub" controls></audio>')
		player.on('ended', function () {
			this.remove();
			socket.emit('pop', {roomName: window.roomName})
		});
		}
		else {
			if(data.metadata !== null) {
				console.log(data.metadata.track.title)
				console.log(data.metadata.track.artist)
			}
		}
		player.on('playing', function () {
			playPub(player);
		});
		player.attr('src', data.url).hide();
		$('#queue').append($('<div></div>').append(player));
		player.fadeIn(800);
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

	})

});
