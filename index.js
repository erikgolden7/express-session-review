// =============================================
// App example 1
// =============================================

// const express = require("express");
// const session = require("express-session");
// const config = require("./config.js");
//
// const createInitialSession = require(`./session.js`);
//
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
// app.get("/", (req, res) => {
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
// app.listen(port, () => {
// 	console.log("Listening on port", port);
// });

// =============================================
// App example 2
// =============================================

const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const config = require("./config.js");
const checkForSession = require(`./session.js`);

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

app.use(checkForSession);

app.get("/", (req, res) => {
	if (req.session.email) {
		res.redirect("/admin");
	} else {
		res.render("index.html");
	}
});

app.post("/login", (req, res) => {
	req.session.email = req.body.email;
	res.end("done");
});

app.get("/admin", (req, res) => {
	if (req.session.email) {
		res.write("<h1>Hello " + req.session.email + "</h1><br>");
		res.end("<a href=" + "/logout" + ">Logout</a>");
	} else {
		res.write("<h1>Please login first.</h1>");
		res.end("<a href=" + "/" + ">Login</a>");
	}
});

app.get("/logout", (req, res) => {
	req.session.destroy(err => {
		if (err) {
			console.log(err);
		} else {
			res.redirect("/");
		}
	});
});

const port = 3000;
app.listen(port, () => {
	console.log("Listening on port", port);
});
