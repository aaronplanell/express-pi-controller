var express = require('express');
var router = express.Router();
var controller = require('../controllers/controller');

// Main page
router.get('/', controller.index);

// Led page
router.get("/leds", controller.show);

module.exports = router;
