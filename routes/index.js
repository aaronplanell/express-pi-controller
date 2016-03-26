var express = require('express');
var router = express.Router();
var GPIO = require('onoff').Gpio
var led = new GPIO(18, 'out');

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log('Inside of index.js');
  
	// Led is attached to pin 18
	var status = led.readSync();
	console.log('Old status: ' + status);
	if (status === 0) led.writeSync(1);
	else led.writeSync(0);
	status = led.readSync();
	console.log('New status: ' + status);

	res.render('index', { title: 'Express / Raspberry Pi / OnOff', status: status });
});

module.exports = router;
