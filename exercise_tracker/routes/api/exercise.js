const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Exercise = mongoose.model("Exercise");
const User = mongoose.model("User");

router.use("/", require("./user"));

router.use("/log", require("./log"));

router.post("/add", (req, res, next) => {
  if (!req.body.userId) {
    return res.status(422).json({ errors: { userId: "can't be blank" } });
  }

  if (!req.body.description) {
    return res.status(422).json({ errors: { description: "can't be blank" } });
  }

  if (!req.body.duration) {
    return res.status(422).json({ errors: { duration: "can't be blank" } });
  } else if (!Number(req.body.duration)) {
    return res.status(422).json({ errors: { duration: "must be number" } });
  }

  if (req.body.date) {
    let date = new Date(req.body.date);
    if (isNaN(date)) {
      return res
        .status(422)
        .json({ errors: { duration: "must be date format (yyyy-mm-dd)" } });
    }
  }

  User.findById(req.body.userId).then(function(user) {
    if (!user) {
      return res.status(422).json({ errors: { user: "can't be found" } });
    }

    const exercise = new Exercise();
    exercise.user = req.body.userId;
    exercise.description = req.body.description;
    exercise.duration = req.body.duration;
    if (req.body.date) {
      exercise.date = new Date(req.body.date);
    } else {
      exercise.date = new Date();
    }

    exercise
      .save()
      .then(function() {
        user
          .addExercise(exercise._id)
          .then(function() {
            return res.json({
              username: user.username,
              description: exercise.description,
              duration: exercise.duration,
              _id: user._id,
              date: exercise.datestring
            });
          })
          .catch(next);
      })
      .catch(next);
  });
});

module.exports = router;
