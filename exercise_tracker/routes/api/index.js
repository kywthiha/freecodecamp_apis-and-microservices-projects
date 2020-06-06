var express = require("express");
var router = express.Router();

router.use('/exercise', require('./exercise'));

module.exports = router