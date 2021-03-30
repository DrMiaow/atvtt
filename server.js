// var child = require('child_process');


import child from "child_process";


import WebSocket from "ws"

import { StreamCamera, Codec, SensorMode, Rotation } from "pi-camera-connect";
import * as fs from "fs";

const runApp = async () => {

    const streamCamera = new StreamCamera({
        codec: Codec.H264,
	fps: 3,
	sensorMode: SensorMode.Mode2,
	rotation: Rotation.Rotate180
    });

    const videoStream = streamCamera.createStream();

    //const writeStream = fs.createWriteStream("video-stream.h264");

    // Pipe the video stream to our video file
    //videoStream.pipe(writeStream);

    await streamCamera.startCapture();

    // We can also listen to data events as they arrive
    videoStream.on("data", data => { 
	// console.log("New data", data);

  	for (const ws of connections) {
        	// console.log('send data ' + data.length)
                //ws.send(data, { binary: true }, (error) => { if (error) console.error(error); });
                ws.send(data, { binary: true });
        }
	});

    videoStream.on("end", data => console.log("Video stream has ended"));

    // Wait for 5 seconds
    // await new Promise(resolve => setTimeout(() => resolve(), 5000));

    //await streamCamera.stopCapture();
};

runApp();



const PORT = 8123;
const DEVICE = "PANASONIC"

const connections = []

async function startServer() {
        const wss = new WebSocket.Server({ port: PORT });
        console.log('Server ready on port ' + PORT);
        wss.on('connection', (ws) => {
                console.log('Socket connected. sending data...');


  		ws.on('message', (message) => {
			console.log(`message ${message}`);

			switch(message) {
				case "Home": sendIRCommand("PANASONIC2","KEY_HOME"); break;
				case "Escape": sendIRCommand(DEVICE,"KEY_ENTER"); break;
				case "Backspace": sendIRCommand(DEVICE,"KEY_ENTER");break;
				case "End": sendIRCommand(DEVICE,"KEY_EXIT");break;
				case "`":sendIRCommand(DEVICE,"KEY_POWER");break;
				case "PageUp": sendIRCommand(DEVICE,"KEY_CHANNELUP");break;
				case "PageDown": sendIRCommand(DEVICE,"KEY_CHANNELDOWN");break;
 				case "ArrowUp": sendIRCommand(DEVICE,"KEY_UP");break;
 				case "ArrowDown": sendIRCommand(DEVICE,"KEY_DOWN");break;
 				case "ArrowLeft": sendIRCommand(DEVICE,"KEY_LEFT");break;
				case "ArrowRight": sendIRCommand(DEVICE,"KEY_RIGHT");break;
				case "Enter": sendIRCommand(DEVICE,"KEY_OK");break;
				case "r": sendIRCommand(DEVICE,"KEY_R");break;
				case "g": sendIRCommand(DEVICE,"KEY_G");break;
				case "b": sendIRCommand(DEVICE,"KEY_B");break;
				case "y": sendIRCommand(DEVICE,"KEY_Y");break;
 				case "[": sendIRCommand(DEVICE,"KEY_REWIND");break;
				case "]": sendIRCommand(DEVICE,"KEY_FASTFORWARD");break;
				case "p": sendIRCommand(DEVICE,"KEY_PAUSE");break;
				case "s": sendIRCommand(DEVICE,"KEY_STOP");break;
				
			}


                });



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

                connections.push(ws);
        });
}

function sendIRCommand(device, key){

  // irsend --device=/var/run/lirc/lircd-tx SEND_ONCE PANASONIC KEY_POWER

  console.info(`SEND ${key} TO ${device}`);

  var args = [
	'--device=/var/run/lirc/lircd-tx',
	'SEND_ONCE',
	device,
	key
  ]


  // the avconv stream that inherits stderr
  var irsend_process = child.spawn('irsend', args, {
    stdio: ['ignore', 'pipe', 'inherit']
  });

  return irsend_process.stdout;
}

//sendIRCommand("PANASONIC","KEY_POWER");



startServer();

