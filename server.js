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
		if (newData.type === 'updateDriver') {
			if (newData.leg) {
				const newLegID = newData.leg.toUpperCase();
				const newProgress = parseInt(newData.progress, 10);
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
		}
		if (newData.type === 'updateBonusDriver') {
			data.bonusDriverLocation = {
				'x': newData.x,
				'y': newData.y
			};
			wss.clients.forEach(function each(client) {
				client.send(JSON.stringify(data));
			});
		}
	});
	ws.on('close', () => {
		console.log('Client disconnected');
		
	});
});