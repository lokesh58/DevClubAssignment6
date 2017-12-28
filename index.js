const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/source/home.html');
});

app.get('/login', (req, res) => {
	res.send("Login will be updated soon");
});

app.get('/register', (req, res) => {
	res.send("Register will be updated soon");
});

app.listen(PORT, () => {
	console.log('Server started on port ' + PORT);
});
