//get the dependencies
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var logger = require("morgan");

//get instance of express app
var express = require("express");
var app = express();

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");
// Require all models
//var db = require("./models");
var PORT = 3000;

// Configure middleware
// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



// Make public a static folder
app.use(express.static("public"));

//set up handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({defaultLayout: "main" }));
app.set("view engine", "handlebars");


// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/scrapperApp", { useNewUrlParser: true });

const MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://localhost/scrapperApp";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// var db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", function () {
//     console.log("Connected to Mongoose!");
// });

var routes = require("./controller/app.js");
//app.use("/", routes);
//Create localhost port
var PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
