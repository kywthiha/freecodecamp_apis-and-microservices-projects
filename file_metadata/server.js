"use strict";

var express = require("express");
var cors = require("cors");

// require and use "multer"...

var app = express();
const multer = require("multer");
const upload = multer({ dest: "upload/" });

app.use(cors());
app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.post("/api/fileanalyse", upload.single("upfile"), function(req, res, next) {
  res.json({
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size
  });
});

app.get("/hello", function(req, res) {
  res.json({ greetings: "Hello, API" });
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Node.js listening ...");
});
