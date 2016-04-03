var express = require('express');
var router = express.Router();
var controller = require('../controllers/controller');

// Main page
router.get("/", controller.index);

// Return JSON of enabled items
router.get("/:type(led|button|status_led)", controller.enabled);

// Return JSON of an item
router.get("/:type(led|button|status_led)/:item(\\d+)", controller.item);

// Switch on a led
router.get("/:type(led)/:item(\\d+)/on", controller.on);

// Switch off a led
router.get("/:type(led)/:item(\\d+)/off", controller.off);

// Switch  a led
router.get("/:type(led)/:item(\\d+)/switch", controller.switch);

// Get the status of a led
router.get("/:type(led)/:item(\\d+)/status", controller.status);

// Get a button of the led
router.get("/:type(led)/:item(\\d+)/button", controller.button);

module.exports = router;
