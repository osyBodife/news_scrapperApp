var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server

var cheerio = require("cheerio");
var axios = require("axios");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/scraperApp", { useNewUrlParser: true });
// var db = process.env.MONGODB_URI || "mongodb://localhost/scraperApp";
// //connect
// mongoose.connect(db, function(error){
//     if(error){
//         console.log(error);
//     }else{
//         console.log("connected to successfully")
//     }
// })

// // Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios
   //axios.get("http://www.echojs.com/").then(function (response) {
        axios.get("https://www.latimes.com/").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        // Now, we grab every h2 within an article tag, and do the following:
            $(".PromoSmall-title").each(function (i, element) {
            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");

            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
                .then(function (dbArticle) {
                    // View the added result in the console
                    console.log("From Db : " + dbArticle);
                })
                .catch(function (err) {
                    // If an error occurred, log it
                    console.log(err);
                });
        });

        // Send a message to the client
        res.send("Scrape Complete");
    });
});

// var cheerio = require("cheerio");
// var axios = require("axios");

// // First, tell the console what server2.js is doing
// console.log("\n******************************************\n" +
//     "Grabbing every article headline and link\n" +
//     "from the NHL website:" +
//     "\n******************************************\n");

// // Making a request via axios for `nhl.com`'s homepage
// //axios.get("https://www.nhl.com/").then(function (response) {
// // Making a request via axios for `nhl.com`'s homepage
// axios.get("https://www.latimes.com/").then(function (response) {

//     // Load the body of the HTML into cheerio
//     var $ = cheerio.load(response.data);

//     // Empty array to save our scraped data
//     var results = [];

//     // With cheerio, find each h4-tag with the class "headline-link" and loop through the results
    
//     $(".PromoSmall-title").each(function (i, element) {
        
//             // Save an empty result object
//             var result = {};
//             // Add the text and href of every link, and save them as properties of the result object
//             result.title = $(this)
//                 .children("a")
//                 .text();
//             result.link = $(this)
//                 .children("a")
//                 .attr("href");
//         // var headline = $(this).children("a").text().trim();

//         // var storylink = $(this).children("a").attr("href");

//         // // Make an object with data we scraped for this h4 and push it to the results array
//         // results.push({
//         //     title: headline,
//         //     link: storylink
//         // });

//             // Create a new Article using the `result` object built from scraping
//             db.Article.create(result)
//                 .then(function (dbArticle) {
//                     // View the added result in the console
//                     console.log("From Db : " + dbArticle);
//                 })
//                 .catch(function (err) {
//                     // If an error occurred, log it
//                     console.log(err);
//                 });
//         });

// //         // Send a message to the client
// //         res.send("Scrape Complete");
// //     });

//     console.log(results);

//     });



// // Route for getting all Articles from the db
// app.get("/articles", function (req, res) {
//     // Grab every document in the Articles collection
//     db.Article.find({})
//         .then(function (dbArticle) {
//             // If we were able to successfully find Articles, send them back to the client
//             res.json(dbArticle);
//         })
//         .catch(function (err) {
//             // If an error occurred, send it to the client
//             res.json(err);
//         });
// });

// // Route for grabbing a specific Article by id, populate it with it's note
// app.get("/articles/:id", function (req, res) {
//     // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
//     db.Article.findOne({ _id: req.params.id })
//         // ..and populate all of the notes associated with it
//         .populate("note")
//         .then(function (dbArticle) {
//             // If we were able to successfully find an Article with the given id, send it back to the client
//             res.json(dbArticle);
//         })
//         .catch(function (err) {
//             // If an error occurred, send it to the client
//             res.json(err);
//         });
// });

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
        .then(function (dbNote) {
            // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function (dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
