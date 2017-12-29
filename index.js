const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const pg = require('pg');
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
	const user = req.cookies['loginInfo'];
	if (user == undefined) {
		res.sendFile(__dirname + '/source/home.html');
	} else {
		res.redirect('/' + user);
	}
});

app.get('/login', (req, res) => {
	const user = req.cookies['loginInfo'];
	if (user == undefined) {
		res.sendFile(__dirname + '/source/login.html');
	} else {
		res.redirect('/' + user);
	}
});

app.post('/login/auth', (req, res) => {
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
					console.log("Query successful");
					if (result.rows.length == 0) {
						res.sendFile(__dirname + '/source/loginfail.html');
					} else {
						res.cookie('loginInfo', user, {maxAge: 3.6e6});
						console.log("Login successful!");
						res.redirect('/' + user);
					}
				}
			});
		}
	});
});

app.get('/register', (req, res) => {
	const user = req.cookies['loginInfo'];
	if (user != undefined) {
		res.clearCookie('loginInfo');
	}
	res.sendFile(__dirname + '/source/register.html');
});

app.post('/register/addUser', (req, res) => {
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
			const checkQ = `SELECT * FROM users WHERE username = '${user}'`;
			client.query(checkQ, (err, result) => {
				if (err) {
					done();
					console.log(err);
					res.send("Error " + err);
				} else {
					if (result.rows.length == 0) {
						const query = `INSERT INTO users (fname, lname, username, password) VALUES ('${fname}', '${lname}', '${user}', '${pass}');`;
						client.query(query, (err, result) => {
							if (err) {
								done();
								console.log(err);
								res.send("Error " + err);
							} else {
								const userQ = `CREATE TABLE ${user} (id serial primary key, note text not null);`;
								client.query(userQ, (err, result) => {
									done();
									if (err) {
										console.log(err);
										res.send("Error " + err);
									} else {
										console.log("Registration successful!");
										res.sendFile(__dirname + '/source/regsuccess.html');
									}
								});
							}
						});
					} else {
						res.send("Username already exists!");
					}
				}
			});
		}
	});
});

app.get('/:user', (req, res) => {
	const userC = req.cookies['loginInfo'];
	const user = req.params.user;
	if (userC == user) {
		res.send('Successfully signed in as ' + user);
	} else {
		res.redirect('/');
	}
});

app.listen(PORT, () => {
	console.log('Server started on port ' + PORT);
});
