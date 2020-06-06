"use strict";

var express = require("express");
var mongo = require("mongodb");
var mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dns = require("dns");
const dnsPromises = dns.promises;

var cors = require("cors");

var app = express();

// Basic Configuration
var port = process.env.PORT || 3000;

/** this project needs a db !! **/

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const ShortUrl = require("./models/shorturl");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.get("/api/shorturl/:id", (req, res, next) => {
  ShortUrl.findById(req.params.id)
    .then(function(shorturl) {
      if (!shorturl) {
        const err = new Error("Shorturl Not Found");
        err.status = 404;
        next(err);
      }
      res.redirect("http://" + shorturl.name);
    })
    .catch(next);
});

app.get("/api/shorturl/", (req, res, next) => {
  ShortUrl.find()
    .then(function(shorturls) {
      if (!shorturls) {
        const err = new Error("Shorturl Not Found");
        err.status = 404;
        next(err);
      }
      res.json(shorturls);
    })
    .catch(next);
});

app.post("/api/shorturl/new", (req, res, next) => {
  let url = req.body.url;
  if (url) {
    const pattern = /^(https?:\/\/)/g;
    url = url.replace(pattern, "");
    dnsPromises
      .lookup(url)
      .then(result => {
        const shorturl = new ShortUrl({ name: url });
        shorturl
          .saveAutoId()
          .then(function() {
            res.json({ original_url: url, short_url: shorturl._id });
          })
          .catch(err => next(new Error("Already exit URL")));
      })
      .catch(err => next(new Error("invalid URL")));
  }
});

app.use(function(req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    errors: err.message
  });
});

app.listen(port, function() {
  console.log("Node.js listening ...h");
});
