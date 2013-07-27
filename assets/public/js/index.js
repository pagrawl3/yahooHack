$(document).ready(function() {
	//JSLint told me to put for some ECMAScript5 optimizations
	"use strict";

	var socket = io.connect('/');
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
		},300)
		bindRoomListeners();
	});


	//Establish a socket conenction with the server for future stuff
	var start = 0;
	var stop = 0;
	var offset = 0;
	var offsets = [];
	var i = 0
	for (i =0; i< 10; i++) {
		window.setTimeout(function(){
			start = window.performance.now();
			socket.emit('test', {success: true});
		},offset);

		if (i = 9)
		 offsetCalibrationComplete();
	}
	socket.on('testCallback', function(data) {
		stop = window.performance.now();
		offset += (stop - start)/10;
	});

	function offsetCalibrationComplete() {
		if (document.getElementById("pub")) {
			var pub = document.getElementById("pub");
			pub.play()
			var bool = false
			pub.addEventListener('timeupdate', function(data){
				if (!bool) {
					pub.currentTime += offset;
					bool = true;
				}
				var times = (pub.currentTime);
				socket.emit('audio-time', {data: times, timestamp: data.timeStamp});
			})
		}

		var once = false;
		if (document.getElementById("sub")) {
			var sub = document.getElementById("sub");
			var pubTime = 0;
			var latency = 0;
			socket.on('time2', function(data) {
				pubTime = data.data;
				if (!once) {
					sub.play();
					sub.currentTime = pubTime;
					once = true;
				}
			})
		}
	}
	$('.test-button').on('click', function() {
		once = false;
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
