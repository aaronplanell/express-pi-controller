var express = require('express');
var router = express.Router();
var controller = require('../controllers/controller');

// Main page
router.get("/", controller.index);

// Return JSON of active leds
router.get("/leds", controller.leds);

// Main page
router.get("/:ledId(\\d+)", controller.changeLed);

module.exports = router;
