"use strict";

var path = require("path");
require('syracuse-nodered/lib/startup');

module.exports = {
	application: "syracuse",
	extends: "collaboration",
	resources: require('./strings').module,
	entities: {},
	representations: {
	},
	dbMeta: {
	    initScript: [],
	    updateScript: [],
		automaticImport: [],
	}
};
