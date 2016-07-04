"use strict";

var path = require("path");
require('syracuse-nodered/lib/startup');

module.exports = {
	application: "syracuse",
	extends: "collaboration",
	resources: require('./strings').module,
	entities: {
		noderedServer: require('./entities/noderedServer').entity
	},
	representations: {
	},
	dbMeta: {
	    initScript: [],
	    updateScript: [],
	    automaticImport: [
		  path.join(__dirname, "imports", "nodered-sitemap.json")
		],
	}
};
