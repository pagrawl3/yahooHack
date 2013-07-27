$(document).ready(function() {
	//JSLint told me to put for some ECMAScript5 optimizations

	var socket = io.connect('/');
	filepicker.setKey('AKuopPE6CTw0vqFI3RA7Az');

	var start = 0;
		var stop = 0;
		var offset = 0;
		var offsets = [];
		function playPub(player) {
			//Establish a socket conenction with the server for future stuff
			var i = 0
			for (i =0; i< 10; i++) {
				window.setTimeout(function(){
					start = window.performance.now();
					socket.emit('test', {success: true});
				},offset);

				if (i = 9) {
					offset = 0;
					stop = 0;
					start = 0;
					offsetCalibrationCompletePub(player);
				}
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
		var twice = false;
		var thrice = false;
		function playSub(player) {
			var pubTime = 0;
			var latency = 0;
			var startTime = 0;
			var endTime = 0;
			player.muted = true;
			socket.on('time2', function(data) {
				endTime = new Date().getTime();
				pubTime = data.data;
				if (!once) {
					startTime = new Date().getTime();
					player.trigger('play');
					player[0].currentTime = pubTime;
					once = true;
				}
				if (((endTime - startTime)/1000 > 1) && !twice) {
					player.muted = false;
					once = false;
					twice = true;
					console.log('here');
				}
				if (((endTime - startTime)/3000 > 1) && !twice) {
					player.muted = false;
					once = false;
					thrice = true;
					console.log('here');
				}

			});
			socket.on('pauseBroadcast', function() {
				player.trigger('pause');
				thrice = false;
				twice = false;
				once = false;
			});
		}

		if($('#sub').length > 0) {
			playSub($('#sub'));
		}
	// function bindRoomListeners () {
	$('html').on('click', '.file-upload', function() {
		console.log('here')
		filepicker.pickAndStore({},{},function(data){
		   console.log(JSON.stringify(data));
		   $('#url').html(data[0].url);
		   // // $('#url').html(data[0].url)
		   var roomName = window.roomName;
		   console.log(roomName)
		   socket.emit('embedSong', {data: data[0], roomName: roomName});
		});
	});
	// }

	$('#createRoom').click(function() {
		console.log(new Date().getTime());
		socket.emit('createNewRoom', {name: new Date().getTime().toString().slice(-6,-1)});
	});

	socket.on('embedSongSuccess', function (data) {
		console.log('embedSuccess');
		console.log($('#main-player').attr("src"));
		if (!$('#main-player').attr("src")) {
			console.log('DATA',data);
			$('.no-songs-wrapper').css('opacity', 0);
			$('.hidden').removeClass('hidden');
			var player = $('#main-player');
			player.attr('src', data.url);
			player.on('playing', function() {
				playPub(player);
			}).on('pause', function() {
				console.log('paused');
				socket.emit('pause');
			}).on('ended', function(){
				socket.emit('pop', {roomName: window.roomName});
				$('#main-player').attr('src', $($('li.song')[0]).attr('url'));
				$($('li.song')[0]).remove();
				playPub(player);
			})
			window.setTimeout(function(){
				$('.no-songs-wrapper').css('display', 'none');
			}, 200);
		} else {
			function createNode(url, filename) {
				return node = '<li url='+url+' class="song colums large-12"><div class="icon rotating rot"></div><div class="album"></div><span class="filename">'+data.filename+'</span><br><span class="title"></span><br><span class="artist"></span></li>'
			}
			$('ul.songs').append(createNode(data.url, data.filename))
			socket.emit('updateQueue', {node: createNode(data.url, data.filename)})
		}
	});

	socket.on('updateQueueSuccess', function(data) {
		$('ul.songs').append(data.node);
	})

	socket.on('createNewRoomSuccess', function (data) {
		window.roomName = data.name;
		$('#wrapper').css('opacity', 0);
		$('#wrapper').css('marginTop', '-20px');
		$('#overlay').css('opacity', 1);
		window.setTimeout(function(){
			$('#wrapper').html(data.html);
			$('#wrapper').css('opacity', 1);
			$('#wrapper').css('marginTop', '0px');
			// bindRoomListeners();
		},500)
	});

	socket.on('loadingSuccess', function(data) {
		console.log(data);
		if ($('li.song').length <=0) {
			$('.now-playing .title').html(data.title);
			$('.now-playing .artist').html(data.artist);
		} else {
			$('li.song').last().children('.title').html(data.title);
			$('li.song').last().children('.artist').html(data.artist);
			$('li.song').last().children('.artist').css('opacity','1');
			$('li.song').last().children('.title').css('opacity','1');
		}
	})

	socket.on('getAlbumArtSuccess', function(data) {
		console.log(data);
		if ($('li.song').length <=0) {
			$('.now-playing .art').css('background', 'url('+data.albumArt+') no-repeat');
			$('.now-playing .art').css('background-size', '100%');
			$('.now-playing .art').css('background-position', 'center center');
		} else {
			$('li.song').last().children('.album').css('background', 'url('+data.albumArt+') no-repeat');
			$('li.song').last().children('.album').css('background-size', '100%');
			$('li.song').last().children('.album').css('background-position', 'center center');
			$('li.song').last().children('.album').css('opacity', '1');
			$('li.song').last().children('.rot').css('opacity', '0');
		}
	})


	$('.test-button').on('click', function() {
		once = false;
	});

	socket.on('popSuccess', function (data) {
		console.log(data)
		var player2 = $('#sub');
		player2.attr('src', $($('li.song')[0]).attr('url'));
		$($('li.song')[0]).remove();
		playSub(player2);
	})

	socket.on('play', function () {

	})

});
