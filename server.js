const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.send({ express: 'Root' });
});

app.get('/legs/', (req, res) => {
	res.send({ express: 'Legs' });
});

app.get('/stops/', (req, res) => {
	res.send({ express: 'Stops' });
});

app.get('/driver/', (req, res) => {
	res.send({ express: 'Driver' });
});

app.post('/driver/', (req, res) => {
	console.log(req.body);
	res.send(
		`I received your POST request. This is what you sent me: ${req.body.post}`,
	);
});

// Bonus API
app.get('/bonusdriver/', (req, res) => {
	res.send({ express: 'Bonus Driver' });
});


app.listen(port, () => console.log(`Listening on port ${port}`));