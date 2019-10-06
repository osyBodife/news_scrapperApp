var cheerio = require("cheerio");
var axios = require("axios");

// First, tell the console what server2.js is doing
console.log("\n******************************************\n" +
    "Grabbing every article headline and link\n" +
    "from the NHL website:" +
    "\n******************************************\n");

// Making a request via axios for `nhl.com`'s homepage
//axios.get("https://www.nhl.com/").then(function (response) {
    // Making a request via axios for `nhl.com`'s homepage
axios.get("https://www.latimes.com/").then(function (response) {

    // Load the body of the HTML into cheerio
    var $ = cheerio.load(response.data);

    // Empty array to save our scraped data
    var results = [];

    // With cheerio, find each h4-tag with the class "headline-link" and loop through the results
   // $("h2.headline").each(function (i, element) {
    $(".PromoSmall-title").each(function (i, element) {

        // Save the text of the h4-tag as "title"
        // var title = $(element).text();

        // // Find the h4 tag's parent a-tag, and save it's href value as "link"
        // var link = $(element).parent().attr("href");
// result.title = $(this)
            //     .children("a")
            //     .text();
            // result.link = $(this)
            //     .children("a")
            //     .attr("href");
        var headline = $(this).children("a").text().trim();

        var storylink = $(this).children("a").attr("href");

        // Make an object with data we scraped for this h4 and push it to the results array
        results.push({
            title: headline,
            link: storylink
        });
    });

    // After looping through each h4.headline-link, log the results
    console.log(results);
});
