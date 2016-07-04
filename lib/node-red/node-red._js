"use strict";

var http = require('http');
var express = require("express");
var RED = require("node-red");
var os = require('os');
var path = require('path');

var config = require('config');
config = (config.iot && config.iot.nodered) || {};
config.port = config.port || 1880;

exports.setup = function() {
	// Create an Express app
	var app = express();

	// Add a simple route for static content served from 'public'
	app.use("/",express.static("public"));

	// Create a server
	var server = http.createServer(app);

	// data.iot.eu-central-1.amazonaws.com
	// Create the settings object - see default settings.js file for other options
	var settings = {
		verbose: true,
	    httpAdminRoot:"/red",
	    httpNodeRoot: "/api",
	    userDir: path.join(process.cwd(), "node_modules/syracuse-iot/lib/servers/node-red/nodes"),
	    functionGlobalContext: { }    // enables global context
	};

	// Initialise the runtime with a server and settings
	RED.init(server,settings);

	// Serve the editor UI from /red
	app.use(settings.httpAdminRoot,RED.httpAdmin);

	// Serve the http nodes UI from /api
	app.use(settings.httpNodeRoot,RED.httpNode);

	server.listen(config.port);
};

exports.start = function(_) {
	// Start the runtime
	RED.start();
	console.log("Node-Red running at http://" + os.hostname() + ":" + config.port);
};
