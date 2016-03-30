var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


/*
 * Control the button & light for the status of the app
 ***/
var nLedA = 18;
var nButton = 22;
var GPIO = require('onoff').Gpio;
var gLedA = new GPIO(nLedA, 'out');
var gButton = new GPIO(nButton, 'in', 'both');

//Default: switch on
gLedA.writeSync(0); 
global.bSwitchOnOff = true;
 
// define the callback function
function light(err, state) {
	if(state == 0) {
		if (bSwitchOnOff === false) {
			bSwitchOnOff = true;
			gLedA.writeSync(0);
			console.log("The led " + nLedA + " is active.");
		} 
		else {
			bSwitchOnOff = false;
			gLedA.writeSync(1);
			console.log("The led " + nLedA + " is not active.");
		};
	};
};
 
// pass the callback function to the
// as the first argument to watch()
gButton.watch(light);

//Exports the status of the button
module.exports = bSwitchOnOff;


//Export application
module.exports = app;
