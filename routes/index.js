var express = require('express');
var router = express.Router();
var GPIO = require('onoff').Gpio
var nLedB = 17;
var gLedB = new GPIO(nLedB, 'out');
gLedB.writeSync(1);

/* GET home page. */
router.get('/', function(req, res, next) {

	//Switch the led
	if (bSwitchOnOff===true) {
		// Led is attached to pin nLedB
		var status = gLedB.readSync();

		if (status === 0) gLedB.writeSync(1);
		else gLedB.writeSync(0);
		status = gLedB.readSync();
	};
	
	//Render de page
	res.render('index', { title: 'Express / Raspberry Pi / Controller', bSwitchOnOff: bSwitchOnOff, status: status });
});

module.exports = router;
