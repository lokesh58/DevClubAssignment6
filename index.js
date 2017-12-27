var express = require('express');
var app = express();

app.get('/', function (req, res) {
	res.send('Just testing the app!');
})

app.listen(8080)
