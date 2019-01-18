const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const legsData = require('./data-files/legs.json');
const stopsData = require('./data-files/stops.json');
const driverLocation = require('./data-files/driver-location.json');

app.get('/', (req, res) => {
	res.send({ express: 'Root' });
});

app.get('/legs/', (req, res) => {
	res.send(legsData);
});

app.get('/stops/', (req, res) => {
	const data = {
		legsData,
		stopsData
	};
	res.send(data);
});

app.get('/driver/', (req, res) => {
	const data = {
		legsData,
		stopsData,
		driverLocation
	};
	res.send(data);
});

app.put('/driver/', (req, res) => {
	console.log(req.body);
	res.send(
		`I received your PUT request. This is what you sent me: ${req.body}`,
	);
});

// Bonus API
app.get('/bonusdriver/', (req, res) => {
	res.send({ express: 'Bonus Driver' });
});


app.listen(port, () => console.log(`Listening on port ${port}`));