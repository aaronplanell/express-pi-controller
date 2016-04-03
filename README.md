# express-pi-controller

  This is a very simple application for controlling GPIO sensors on a [Raspberry Pi](https://www.raspberrypi.org/). It uses [node](http://nodejs.org), [Express](http://expressjs.com/) and the [OnOff](https://www.npmjs.com/package/onoff) package. 
  Use at your own risk.


## Installation

```bash
$ npm install express-pi-controller
```


## Features

  * Controls any GPIO you have connected
  * Config file to enable/disable every GPIO
  * Button On/Off to enable/disable the app
  * Status Led that shows if the app is enabled
  * A web service API based on JSON


## Quick start

```bash
cd node_modules/express-pi-controller
sudo npm start
```
Then go to the http://127.0.0.1 in a web browser


## Configure

Edit the file model\bcms.json

## Default values

  * BCM 17: Led
  * BCM 18: Led
  * BCM 24: Status Led
  * BCM 25: Button


## Use of the JSON API

  * "/:type(led|button|status_led)" -> Return JSON of enabled items
  * "/:type(led|button|status_led)/:item(\\d+) -> Return JSON of an specific item
  * "/:type(led)/:item(\\d+)/on" -> Switch on a led (obviously, only for leds).
  * "/:type(led)/:item(\\d+)/off" -> Switch off a led (obviously, only for leds).
  * "/:type(led)/:item(\\d+)/switch" -> Switch a led (obviously, only for leds).


## People

The author of this module is [Aaron Planell](mailto:aaronplanell@gmail.com)


## License

  [GNU](LICENSE)