var colors = require('colors');

//Load the status leds
var leds = require('../model/leds.json');

/*
 * Prepare de Leds
 * - Main Led: 17
 * - Status Led: 24
 * - Button: 25
 * The button controls the status of the Status Led
 ***/
var GPIO = require('onoff').Gpio
var nLedA = 24;
var gLedA = new GPIO(nLedA, 'out');
var nButton = 25;
var gButton = new GPIO(nButton, 'in', 'both');
var nLedB = 17;
var gLedB = new GPIO(nLedB, 'out');
gLedB.writeSync(1);

/*
 * bSwitchOnOff: Controls the status of the Status Led.
 * bStatusLed: Controls the main led
 ***/
var bSwitchOnOff = false;
var bStatusLed = 0;


/*
 * Controls the button & light for the status of the app
 ***/
// define the callback function
var changeStatusLed = function (err, state) {
	if(state == 0) {
		if (bSwitchOnOff === false) {
			bSwitchOnOff = true;
			gLedA.writeSync(0);
			console.log(colors.yellow("The led " + nLedA + " is active."));
		} 
		else {
			bSwitchOnOff = false;
			gLedA.writeSync(1);
			console.log(colors.grey("The led " + nLedA + " is not active."));
		};
	};
};
 
exports.loadButton = function () {

	//Default: switch on
	gLedA.writeSync(0); 
	bSwitchOnOff = true;
	 
	// pass the callback function to the
	// as the first argument to watch()
	gButton.watch(changeStatusLed);
};


/*
 * Controls the main led
 ***/

var isEnabled = function (ledId) {
	var gLed = leds.filter(function(item) { return item.id === ledId; });
	console.log(gLed);
	var isEnabled = gLed.enabled;
	if (isEnabled === null || isEnabled === undefined) isEnabled = false;
	return(isEnabled);
};

//Switch the led
var doChange = function () {

	/*
	if (isEnabled(nLedB)===false) {
		console.log("The led with id " + nLedB + " is not enabled.");
		return;
	};
	*/

	if (bSwitchOnOff===false) {
		console.log("Cannot change the led " + nLedB + ". Press first the button.");
		return;
	};
		
	// Led is attached to pin nLedB
	bStatusLed = gLedB.readSync();

	if (bStatusLed === 0) {
		gLedB.writeSync(1);
		console.log(colors.grey("The led " + nLedB + " is not active."));
	} else {
		gLedB.writeSync(0);
		console.log(colors.red("The led " + nLedB + " is active."));
	}
	bStatusLed = gLedB.readSync();
};

//Render de page
var renderMainPage = function (req, res, next) {
	res.render('index', { title: 'Express / Raspberry Pi / Controller', bSwitchOnOff: bSwitchOnOff, status: bStatusLed, ledId: nLedB });
};

//Switch the led & Render de page
exports.index = function (req, res, next) {
	doChange();
	renderMainPage(req, res, next);
};

//Return the leds and their status
exports.show = function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(leds));	
}