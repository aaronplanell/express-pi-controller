var colors = require('colors');

//Load the BCMs
var bcms = require('../model/bcms.json');


/*
 * Prepare de Leds/Button
 * - Status Led: Indicates if all the process is active.
 * - Button: On/Off the process
 * - Main Led: 17
 * The button controls the status of the Status Led
 ***/

var GPIO = require('onoff').Gpio
var nStatusLed;
var gStatusLed;
var nButton;
var gButton;


/*
 * Search functions
 ***/
var isEnabled = function (bcmId) {

	var gBcm = bcms.filter(function(item) { return item.id === parseInt(bcmId); });
	var isEnabled = false;
	if (gBcm!==undefined && gBcm.length===1) isEnabled = gBcm[0].enabled;
	return(isEnabled);
};


var setStatusLed = function () {

	var gBcm = bcms.filter(function(item) { return item.type === "status_led"; });
	var idGpio = 0;
	if (gBcm!==undefined && gBcm.length===1) idGpio = gBcm[0].id;
	if (idGpio!==0) {
		nStatusLed = idGpio;
		gStatusLed = new GPIO(nStatusLed, 'out');
		return(true);
	}
	else {
		console.log(colors.bgRed("Warning: The status led is not defined."));
		return(false);
	}
};


var setButton = function () {

	var gBcm = bcms.filter(function(item) { return item.type === "button"; });
	var idGpio = 0;
	if (gBcm!==undefined && gBcm.length===1) idGpio = gBcm[0].id;
	if (idGpio!==0) {
		nButton = 25;
		gButton = new GPIO(nButton, 'in', 'both');
		return(true);
	}
	else {
		console.log(colors.bgRed("Warning: The button is not defined."));
		return(false);
	}
};


/*
 * Default values:
 * - sStatusLed: Controls the status of the Status Led. Active.
 * - sMainLed: Controls the main led. Unactive.
 ***/

var sStatusLed = false;
var nMainLed = 17;
var gMainLed = new GPIO(nMainLed, 'out');
var sMainLed = 0;


/*
 * Controls the button & light for the status of the app
 ***/

// define the callback function
var changeStatusLed = function (err, state) {

	if(state == 0) {
		if (sStatusLed === false) {
			sStatusLed = true;
			gStatusLed.writeSync(0);
			console.log(colors.yellow("The led " + nStatusLed + " is active."));
		} 
		else {
			sStatusLed = false;
			gStatusLed.writeSync(1);
			console.log(colors.grey("The led " + nStatusLed + " is not active."));
		};
	};
};

//Loads the button. Called by the app.js 
exports.loadButton = function () {

	//Set status led
	setStatusLed();

	//Set the button
	setButton();

	//Default: switch on
	gStatusLed.writeSync(0); 
	sStatusLed = true;
	 
	// pass the callback function to the
	// as the first argument to watch()
	gButton.watch(changeStatusLed);
};


/*
 * Controls the main led
 ***/

//Switch the led
var doChange = function (nMainLed) {

	if (!isEnabled(nMainLed)) {
		console.log(colors.bgRed("Warning: The led " + nMainLed + " is not enabled. Someone is trying to hack us!"));
		return;
	};		

	if (!sStatusLed) {
		console.log(colors.bgYellow("Warning: Cannot change the led " + nMainLed + ". Press first the button."));
		return;
	};
		
	// Led is attached to pin nMainLed
	sMainLed = gMainLed.readSync();

	if (sMainLed === 0) {
		gMainLed.writeSync(1);
		console.log(colors.grey("The led " + nMainLed + " is not active."));
	} else {
		gMainLed.writeSync(0);
		console.log(colors.red("The led " + nMainLed + " is active."));
	}
	sMainLed = gMainLed.readSync();
};


//Render de page
var renderMainPage = function (req, res, next) {
	res.render('index', { title: 'Express / Raspberry Pi / Controller', sStatusLed: sStatusLed, status: sMainLed, ledId: nMainLed });
};


//Switch the led & Render de page
exports.index = function (req, res, next) {
	doChange(nMainLed);
	renderMainPage(req, res, next);
};

exports.changeLed = function (req, res, next) {
	doChange(req.params.ledId);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(bcms.filter(function(item) { return (item.type === "led" && item.enabled === true) })));	
};

//Return the active leds
exports.leds = function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(bcms.filter(function(item) { return (item.type === "led" && item.enabled === true) })));	
};
