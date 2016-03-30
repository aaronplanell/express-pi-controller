var GPIO = require('onoff').Gpio
var nLedB = 17;
var gLedB = new GPIO(nLedB, 'out');
gLedB.writeSync(1);
global.bStatusLed = 0;

//Switch the led
var doChange = function () {
	if (bSwitchOnOff===true) {
		// Led is attached to pin nLedB
		bStatusLed = gLedB.readSync();

		if (bStatusLed === 0) {
			gLedB.writeSync(1);
			console.log("The led " + nLedB + " is not active.");
		} else {
			gLedB.writeSync(0);
			console.log("The led " + nLedB + " is active.");
		}
		bStatusLed = gLedB.readSync();
	} else {
		console.log("Cannot change the led " + nLedB + ". Press first the button.");
	};
};

//Render de page
var renderMainPage = function (req, res, next) {
	res.render('index', { title: 'Express / Raspberry Pi / Controller', bSwitchOnOff: bSwitchOnOff, status: bStatusLed });
};

//Switch the led & Render de page
exports.index = function (req, res, next) {
	doChange();
	renderMainPage(req, res, next);
};
