var mongoose = require('mongoose'),
    Room = mongoose.model('Room'),
    fs 			= require('fs'),
	jade 		= require('jade'),
	request = require('request')

exports.createNewRoom = function (data, socket) {
	console.log('creating new room');
	var newUrl = 'localhost:3000/rooms/'+data.name,
		newRoom = new Room({
			room_name: data.name,
			url : newUrl,
			files : []
		});
	newRoom.save(function (err, data2) {
		console.log(err, data)
		var pathToTemplate = require('path').resolve(__dirname, '../views') + '/rooms_partial.jade';
        var template = fs.readFileSync(pathToTemplate, 'utf8');
        var jadeFn = jade.compile(template, { filename: pathToTemplate, pretty: true });
        var renderedTemplate = jadeFn({room: data.name});
        socket.emit('createNewRoomSuccess', {html : renderedTemplate, url : newUrl, name: data.name, userType: 'publisher'})
	});
}

exports.getRoom = function (req, res) {
	var roomName = req.params.roomId;
	console.log(req.params.roomId)
	Room.findOne({room_name: roomName}, function (err, docs) {
		console.log('logging roomName : ', docs)
		// res.render('index');
		docs['userType'] = 'subscriber'
		res.render('rooms', docs)
	})
}

getAlbumArt = function (artist_id, count, socket) {
    console.log(artist_id, typeof(artist_id))
	request.post(
	    'http://developer.echonest.com/api/v4/artist/images',
	    { form: { api_key: 'MYH0286UM2UX0WTYI', id: artist_id, format: 'json', results: 1, start: 0, license: 'unknown' } },
	    function (error, response, body) {
	    	console.log('inside the album art response')
	    	console.log(error, response.statusCode)
	        if (!error && response.statusCode == 200) {
	        	console.log('emmitting', JSON.parse(body).response.images[0].url)
	        	socket.emit('getAlbumArtSuccess', {albumArt : JSON.parse(body).response.images[0].url})
	        }
	    }
	);
}

// http://developer.echonest.com/api/v4/artist/images?api_key=MYH0286UM2UX0WTYI&id=ARH6W4X1187B99274F&format=json&results=1&start=0&license=unknown

getMetadata = function (url, count, files, room, data, socket) {
	request.post(
	    'http://developer.echonest.com/api/v4/track/upload',
	    { form: { api_key: 'MYH0286UM2UX0WTYI', url: url } },
	    function (error, response, body) {
	        if (!error && response.statusCode == 200) {
	        	body = JSON.parse(body)
	        	if (!!!body.response.track.title) {
	        		if (count < 3) {
	        			getMetadata(url, count + 1, files, room, data, socket)
	        		} else {
	        			socket.emit('loadingSuccess', {title: data.data.filename, artist: 'Unknown'})	
	        		}
	        	} else {
	        		data.data['title'] = body.response.track.title
	        		data.data['artist'] = body.response.track.artist
	        		Room.findById(room._id, function (err, newRoom) {
	        			newRoom.files = newRoom.files.slice(0,-1)
	        			newRoom.files.push(data.data);
	        			console.log(newRoom.files[0])
	        			newRoom.save(function () {
		        			console.log('saved ; now emitting')
							socket.emit('loadingSuccess', {title: data.data.title, artist: data.data.artist})
	        			});
	        		})
					// if (!!body.response.track.artist_id) {
					// 	console.log('going to get album art')
					// 	console.log(body.response.track.artist_id)
					// 	getAlbumArt(body.response.track.artist_id, 0, socket)
					// }
	        	}
	        }
	    }
	);
}

exports.embedSong = function (data, socket) {
	console.log(data.roomName)
	Room.findOne({room_name: data.roomName}, function (err, docs) {
		if (!docs.files) {
			docs.files = []
		}
		docs.files.push(data.data)
		console.log(docs.files)
		docs.save(function (err) {
			socket.emit('embedSongSuccess', {success: true, message: 'Song was embedded', url: data.data.url, metadata:null, files: docs.files, player : true})
			getMetadata(data.data.url, 0, docs.files, docs, data, socket)
		});
	})
}

exports.pop = function (data, socket) {
	Room.findOne({room_name: data.roomName}, function (err, docs) {
		docs.files = docs.files.slice(1)
		docs.save(function (err, data) {
			console.log('testing pop')
			socket.emit('popSuccess', {success: true, message: 'Last played song was deleted', files: docs.files})
		})
	})
}

exports.startPlay = function (data, socket) {
	socket.emit('play');
}