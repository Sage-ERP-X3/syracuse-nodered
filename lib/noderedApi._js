"use strict";

var adminHelper = require("syracuse-collaboration/lib/helpers").AdminHelper;
var locale = require("syracuse-core/lib/locale");

exports.$exported = true;

exports.noderedHttpRequest = function(_, srvName, httpMethod, subUrl, parameters, data) {

	var db = adminHelper.getCollaborationOrm(_);
	var model = db.model;
	var entity = model.getEntity(_, "noderedServer");
	var filter = {
		sdataWhere: "name eq '" + srvName + "'"
	};
	var instance = db.fetchInstances(_, entity, filter)[0];
	if (!instance) throw new Error("Nodered server configuration '"+srvName+"' not found");
	return instance.execRequest(_, httpMethod, subUrl, parameters, data);
};