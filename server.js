const WebSocket = require('ws');
var raspividStream = require('raspivid-stream');

var videoStream = raspividStream();

// To stream over websockets:
videoStream.on('data', (data) => {
	console.log('got data ' + data.length)
	//console.log(data.toString('hex'))

	for (const ws of connections) {
	 	console.log('send data ' + data.length)
		ws.send(data, { binary: true }, (error) => { if (error) console.error(error); });	
	}	
});


const PORT = 8123;

const connections = []

async function startServer() {
	wss = new WebSocket.Server({ port: PORT });
	console.log('Server ready on port ' + PORT);
	wss.on('connection', (ws) => {
		console.log('Socket connected. sending data...');
		
		ws.on('open', (error) => {
			console.log('WebSocket open');
			connections.push(ws);
		});

		ws.on('error', (error) => {
			console.log('WebSocket error');
		});
		ws.on('close', (msg) => {
			console.log('WebSocket close');

			// Remove connection from array.
			const index = connections.indexOf(ws);
			if (index > -1) {
				console.log(`Removed connection at index ${index}`);
				connections.splice(index, 1);
			}			

		});
	});
}

startServer();
