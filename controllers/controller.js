var colors = require('colors');

//Load the BCMs
var bcms = require('../model/bcms.json');
var errors = require('../model/errors.json');

//The message class
function message(success, sStatusLed, bcm, errors) {
    this.success = success;  
    this.sStatusLed = sStatusLed;
    this.bcm = bcm;
    this.errors = errors;
};

function person(first, last, age, eye) {
    this.firstName = first;
    this.lastName = last;
    this.age = age;
    this.eyeColor = eye;
}

/*
 * Prepare de Leds/Button
 * - Status Led: Indicates if all the process is active.
 * - Button: On/Off the process
 * - Main Led: 
 * The button controls the status of the Status Led
 ***/

var GPIO = require('onoff').Gpio
var nStatusLed;
var gStatusLed;
var sStatusLed;
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
		//Warning: The status led is not defined.
		errors[0].enabled = true;
		console.log(colors.bgRed(errors[0].message));
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
		//Warning: The button is not defined.
		errors[1].enabled = true;
		console.log(colors.bgRed(errors[1].message));
		return(false);
	}
};

/*
 * Disable errors. 
 * It's called at the first time of every transaction
 ***/
var disableErrors = function () {
	for (var i=0; i<errors.length; i++)
		errors[i].enabled = false;
};


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
			console.log(colors.yellow("The led " + nStatusLed + " is not active."));
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
 * Controls the main item
 ***/
exports.loadGPIO = function () {
	for (i=0; i<bcms.length; i++) {
		if (bcms[i].enabled === true) {
			var item = parseInt(bcms[i].id);
			bcms[i].GPIO = new GPIO(item, 'out');

			//Load the default values
			bcms[i].GPIO.writeSync(bcms[i].status);
		}
	}
}

var getGpio = function(item) {
	for (i=0; i<bcms.length; i++) {
		if (item === parseInt(bcms[i].id)) {
			return(bcms[i]);
		}
	}

	return(null);
}

//Set the value of the item
var value = function (item, new_status) {

	if (!isEnabled(item)) {

		//Warning: The led is not enabled.
		errors[2].enabled = true;
		console.log(colors.bgRed(errors[2].message));
		return (false);
	};		

	if (!sStatusLed) {
		//Warning: Cannot on/off the led. Please, press first the button.
		errors[3].enabled = true;
		console.log(colors.bgRed(errors[3].message));
		return (false);
	};
		
	// Led is attached to pin item
	var bcm = getGpio(item);
	if (bcm !== null) {
		bcm.GPIO.writeSync(new_status);
		bcm.status = bcm.GPIO.readSync();
		console.log(colors.red("The item " + item + " has this value: " + new_status));
	} else {
		//Warning: The led is not loaded.
		errors[4].enabled = true;
		console.log(colors.bgRed(errors[4].message));
		return (false);
	}

	return(true);
};


/*
 * Renders
 ***/

//Switch the led & Render de main page
exports.index = function (req, res, next) {
	var leds = bcms.filter(function(item) { return (item.type === "led" && item.enabled === true) });
	res.render('index', { title: 'Express / Raspberry Pi / Controller', sStatusLed: sStatusLed, leds: leds });
};

//Return the active items
exports.enabled = function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(bcms.filter(function(item) { return (item.type === req.params.type && item.enabled === true) })));	
};

//Return one item
exports.item = function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
	var bcm = getGpio(parseInt(req.params.item));
	if( bcm!== null) {
	    res.send(JSON.stringify(bcm));	
	} else {
		res.send(JSON.stringify(null));
	}
};

//Switch on one item
exports.on = function (req, res, next) {
	disableErrors();
	var result = value(parseInt(req.params.item), 0);
	var curMessage = new message(result, sStatusLed, getGpio(parseInt(req.params.item)), errors.filter(function(item) { return (item.enabled === true) }) );
    res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(curMessage));
};

//Switch off one item
exports.off = function (req, res, next) {
	disableErrors();
	var result = value(parseInt(req.params.item), 1);
	var curMessage = new message(result, sStatusLed, getGpio(parseInt(req.params.item)), errors.filter(function(item) { return (item.enabled === true) }) );
    res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(curMessage));
};

//Switch the item
exports.switch = function (req, res, next) {
	disableErrors();
	var result = false;
	var bcm = getGpio(parseInt(req.params.item));
	if( bcm!== null) {
		result = value(parseInt(req.params.item), Math.abs(1-bcm.status));
	}

	var curMessage = new message(result, sStatusLed, getGpio(parseInt(req.params.item)), errors.filter(function(item) { return (item.enabled === true) }) );
    res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(curMessage));
};

// Get the status of a led
exports.status = function (req, res, next) {
	disableErrors();
	var result = true;
	var curMessage = new message(result, sStatusLed, getGpio(parseInt(req.params.item)), errors.filter(function(item) { return (item.enabled === true) }) );
    res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(curMessage));
};
