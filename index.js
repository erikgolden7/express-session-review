// const express = require("express");
// const session = require("express-session");
// const config = require("./config.js");
//
// const createInitialSession = require(`./session.js`);
// const app = express();
//
// app.use(
// 	session({
// 		secret: config.secret,
// 		resave: false,
// 		saveUninitialized: false,
// 		cookie: { maxAge: 5000 }
// 	})
// );
//
// app.use((req, res, next) => createInitialSession(req, res, next));
//
// app.get("/", function(req, res) {
// 	console.log(req);
// 	if (req.session.page_views) {
// 		req.session.page_views++;
// 		res.send("You visited this page " + req.session.page_views + " times");
// 	} else {
// 		req.session.page_views = 1;
// 		res.send("Welcome to this page for the first time!");
// 	}
// });
//
// const port = 3000;
// app.listen(port, function() {
// 	console.log("Listening on port", port);
// });

// =============================================

const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const config = require("./config.js");
const createInitialSession = require(`./session.js`);

const app = express();

app.set("views", __dirname + "/views");
app.engine("html", require("ejs").renderFile);

app.use(
	session({
		secret: config.secret,
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: 60000 }
	})
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => createInitialSession(req, res, next));

app.get("/", function(req, res) {
	console.log(req.session);
	if (req.session.email) {
		res.redirect("/admin");
	} else {
		res.render("index.html");
	}
});

app.post("/login", function(req, res) {
	console.log(req.session);
	req.session.email = req.body.email;
	res.end("done");
});

app.get("/admin", function(req, res) {
	console.log(req.session);
	if (req.session.email) {
		res.write("<h1>Hello " + req.session.email + "</h1><br>");
		res.end("<a href=" + "/logout" + ">Logout</a>");
	} else {
		res.write("<h1>Please login first.</h1>");
		res.end("<a href=" + "/" + ">Login</a>");
	}
});

app.get("/logout", function(req, res) {
	req.session.destroy(function(err) {
		console.log(req.session);
		if (err) {
			console.log(err);
		} else {
			res.redirect("/");
		}
	});
});

const port = 3000;
app.listen(port, function() {
	console.log("Listening on port", port);
});
