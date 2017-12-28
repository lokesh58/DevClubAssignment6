const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const pg = require('pg');

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/source/home.html');
});

app.get('/login', (req, res) => {
	res.sendFile(__dirname + '/source/login.html');
});

app.post('/auth', (req, res) => {
	const user = req.body.user;
	const pass = req.body.pass;
	console.log('Username: ' + user);
	console.log('Password: ' + pass);
	//res.send('Working on login Auth');
	pg.connect(process.env.DATABASE_URL, (err, client, done) => {
		if (err) {
			console.error(err);
			res.send("Error " + err);
		} else {
			const query = `SELECT * FROM users WHERE username = '${user}' AND password = '${pass}';`;
			console.log("Given query is: " + query);
			client.query(query, (err, result) => {
				done();
				if (err) {
					console.error(err);
					res.send("Error " + err);
				} else {
					res.send("Query successful" + result.number);
				}
			});
		}
	});
});

app.get('/register', (req, res) => {
	res.sendFile(__dirname + '/source/register.html');
});

app.post('/addUser', (req, res) => {
	const fname = req.body.fname;
	const lname = req.body.lname;
	const user = req.body.user;
	const pass = req.body.pass;
	console.log('FName: ' + fname);
	console.log('LName: ' + lname);
	console.log('Username : ' + user);
	console.log('Password : ' + pass);
	//res.send('Working on registration');

	pg.connect(process.env.DATABASE_URL, (err, client, done) => {
		if (err) {
			console.error(err);
			res.send("Error " + err);
		} else {
			const query = `INSERT INTO users (username, password, fname, lname) VALUES ('${user}', '${pass}', '${fname}', '${lname}');`;
			console.log("Given query is: " + query);
			client.query(query, (err, result) => {
				done();
				if (err) {
					console.error(err);
					res.send("Error " + err);
				} else {
					res.send("Succesfully registered" + result);
				}
			});
		}
	});
});

app.listen(PORT, () => {
	console.log('Server started on port ' + PORT);
});
