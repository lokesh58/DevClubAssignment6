const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/source/home.html');
});

app.get('/login', (req, res) => {
	res.sendFile(__dirname + '/source/login.html');
});

app.post('/auth', (req, res) => {
	console.log('Username: ' + req.body.user);
	console.log('Password: ' + req.body.pass);
	res.send('Working on login Auth');
});

app.get('/register', (req, res) => {
	res.send("Register will be updated soon");
});

app.listen(PORT, () => {
	console.log('Server started on port ' + PORT);
});
