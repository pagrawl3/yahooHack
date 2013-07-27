$(document).ready(function() {
	//JSLint told me to put for some ECMAScript5 optimizations
	"use strict";

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

})