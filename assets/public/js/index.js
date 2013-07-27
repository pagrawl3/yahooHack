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

	socket.on('createNewRoomSuccess', function (data) {
		window.roomName = data.name;
		console.log(data);
		$('#wrapper').replaceWith(data.html);
		bindRoomListeners();
	});

	socket.on('embedSongSuccess', function (data) {
		// $('#upload').hide();
		console.log(data.files)
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
	});

	socket.on('popSuccess', function (data) {
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
