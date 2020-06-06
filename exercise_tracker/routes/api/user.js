const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");

router.get("/users", (req, res, next) => {
  User.find()
    .then(function(user) {
      if (!user) {
        return res.sendStatus(401);
      }
      return res.json(user);
    })
    .catch(next);
});

router.post("/new-user", (req, res, next) => {
  if (typeof req.body.username === "undefined") {
    return res.json({ error: "username is required" });
  }

  if (req.body.username) {
    const user = new User({ username: req.body.username });

    user
      .save()
      .then(function() {
        if (!user) {
          return res.sendStatus(401);
        }
        return res.json(user);
      })
      .catch(next);
  }
});

module.exports = router;
