
"use strict";
var fs = require('fs');
var config = require('config');

config = config.iot;

console.log("==============\nSyracuse-nodered startup...");
if (config.nodered && config.nodered.active) {
	require('syracuse-nodered/lib/node-red/node-red').setup();
}

if (config.nodered && config.nodered.active) {
	require('syracuse-nodered/lib/node-red/node-red').start(_);
}	


