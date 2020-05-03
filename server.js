var raspividStream = require('raspivid-stream');

var videoStream = raspividStream();

// To stream over websockets:
videoStream.on('data', (data) => {
	console.log('got data ' + data.length)
	console.log(data.toString('hex'))
//ws.send(data, { binary: true }, (error) => { if (error) console.error(error); });
});
