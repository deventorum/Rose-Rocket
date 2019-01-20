const express = require('express');
const SocketServer = require('ws').Server;

const port = 5000;

const legsData = require('./data-files/legs.json');
const stopsData = require('./data-files/stops.json');

const data = {
	legsData: legsData,
	stopsData: stopsData,
	driverLocation: {
		'activeLegID': 'FG',
		'legProgress': 33
	},
	bonusDriverLocation: {
		'x': 50,
		'y': 55
	}
};
// checks data validity from a client
const checkDriverData = (leg, progress) => {
	let output = false;
	legsData.forEach(el => {
		if (el.legID === leg) {
			output = true;
		}
	});
	if (progress > 100 || progress < 0 || isNaN(progress)) {
		output = false;
	}
	return output;
};

const server = express()
	.use(express.static('public'))
	.listen(port, '0.0.0.0', 'localhost', () => console.log(`Listening on ${port}`));

const wss = new SocketServer({ server });

wss.on('connection', (ws) => {
	
	ws.send(JSON.stringify(data));
	console.log('newClient');

	ws.on('message', function incoming(incomingData) {
		console.log('received: ', incomingData);
		const newData = JSON.parse(incomingData);

		const newLegID = newData.leg.toUpperCase();
		const newProgress = parseInt(newData.progress, 10);

		if (checkDriverData(newLegID, newProgress)) {
			data.driverLocation = {
				'activeLegID': newLegID,
				'legProgress': newProgress
			};
	
			wss.clients.forEach(function each(client) {
				client.send(JSON.stringify(data));
			});
		} else {
			// sends an error message for react to render
			ws.send(JSON.stringify({error: 'Please specify the leg'}));
		}
	});
	ws.on('close', () => {
		console.log('Client disconnected');
		
	});
});