var context;
window.addEventListener('load', init, false);
function init() {
	// var source;
	// try {
	// 	// Fix up prefixing
	// 	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	// 	var context = new AudioContext();

	// 	function loadSound(url) {
	// 		var request = new XMLHttpRequest();
	// 		request.open('GET', url, true);
	// 		request.responseType = 'arraybuffer';

	// 	  	// Decode asynchronously
	// 	  	request.onload = function() {
	// 	  		context.decodeAudioData(request.response, function (buffer) {
	// 	  			window.source = context.createBufferSource(); // creates a sound source
 //  					window.source.buffer = buffer;
 //  					window.source.connect(context.destination);       // connect the source to the context's destination (the speakers)
	// 	  		});

	// 	  	}
	// 	 	request.send();
	// 	}
	// 	loadSound('http://upload.wikimedia.org/wikipedia/commons/a/a9/Tromboon-sample.ogg');
	// }
	// catch(e) {
	// 	alert('Web Audio API is not supported in this browser');
	// }
	// $('#play').click(function () {
	// 	window.source.start(0);
	// });
	// $('#stop').toggle(function () {
	// 	window.source.disconnect();
	// }, function () {
	// 	window.source.connect();
	// });
	// var sound = new Howl({
 //  		urls: ['http://upload.wikimedia.org/wikipedia/commons/a/a9/Tromboon-sample.ogg']
	// }).play();
	// var sound2 = new Howl({
 //  		urls: ['http://upload.wikimedia.org/wikipedia/commons/a/a9/Tromboon-sample.ogg']
	// }).play().pos(2);
	// setTimeout(function () {
	// 	alert('time');
	// }, 1500);
}