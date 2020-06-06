const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Exercise = mongoose.model("Exercise");
const User = mongoose.model("User");

router.get("/", (req, res, next) => {
  let limit = 0;
  const logQuery = {};

  if (!req.query.userId) {
    return res.status(422).json({ errors: { userId: "can't be blank" } });
  } else {
    logQuery.user = req.query.userId;
  }

  if (req.query.limit) {
    const limittemp = Number(req.query.limit);
    if (limittemp) {
      limit = limittemp;
    } else {
      return res
        .status(422)
        .json({ errors: { limit: "limit must be number" } });
    }
  }

  if (req.query.from) {
    const fromtemp = new Date(req.query.from);
    if (isNaN(fromtemp)) {
      return res
        .status(422)
        .json({ errors: { from: "from must be date format (yyyy-mm-dd)" } });
    } else {
      if (!logQuery.date) {
        logQuery.date = {};
      }
      logQuery.date["$gte"] = fromtemp;
    }
  }

  if (req.query.to) {
    const totemp = new Date(req.query.to);
    if (isNaN(totemp)) {
      return res
        .status(422)
        .json({ errors: { to: "from must be date format (yyyy-mm-dd)" } });
    } else {
      if (!logQuery.date) {
        logQuery.date = {};
      }
      logQuery.date["$lte"] = totemp;
    }
  }

  Promise.all([
    User.findById(req.query.userId),
    Exercise.find(logQuery).limit(limit)
  ])
    .then(function(results) {
      if (!results) {
        return res.status(422).json({ errors: { user: "user not found" } });
      }
      const user = {
        _id: results[0]._id,
        username: results[0].username
      };

      user.count = results[1].length;
      user.log = results[1].map(exercise => ({
        description: exercise.description,
        duration: exercise.duration,
        date: exercise.datestring
      }));
      return res.json(user);
    })
    .catch(next);
});

module.exports = router;
