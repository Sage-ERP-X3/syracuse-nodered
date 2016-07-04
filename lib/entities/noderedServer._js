"use strict";

var http = require('http');
var httpClient = require('syracuse-httpclient/lib/httpClient');
var trace = console.log;

exports.entity = {
	$titleTemplate: "Nodered instance",
	$descriptionTemplate: "Nodered instance",
	$valueTemplate: "{name}",
	$properties: {
		name: {
			$title: "Name"
		},
		host: {
			$title: "Host",
		},
		port: {
			$title: "Port"
		}
	},
	$functions: {
		execRequest: function(_, method, subUrl, parameters, data) {
			var self = this;
			parameters = parameters || {};

			trace && trace("============ Nodered call begins ================");
			trace && trace("Name: " + this.name(_));
			trace && trace("=====================================================");

			var i;
			// general options
			var opt = {
				method: method,
				headers: {}
			};


			var url = 'http://' + this.host(_) + ':' + this.port(_) + '/api' + subUrl;
			var params = {};
			for (i = 0; i < Object.keys(parameters).length; i++) {
				params[Object.keys(parameters)[i]] = parameters[Object.keys(parameters)[i]];
			}

			if (Object.keys(params).length !== 0) {
				if (url.indexOf('?') !== -1) {
					url += "&";
				} else {
					url += "?";
				}
				for (i = 0; i < Object.keys(params).length; i++) {
					if (i > 0) url += "&";
					url += Object.keys(params)[i] + "=" + params[Object.keys(params)[i]];
				}
			}

			if (data && (method === "POST" || method === "PUT")) {
				// to be compliant with pure JSON object
				if (typeof data === "object") data = JSON.stringify(data);
				opt.headers["content-length"] = data.length;
			} else {
				data = undefined;
			}

			// Set final url
			opt.url = url;

			trace && trace("Options: " + JSON.stringify(opt, null, 2));

			// Request
			var request = httpClient.httpRequest(_, opt);
			var response = request.end(data).response(_);


			var content = response.readAll(_);
			trace && trace("CONTENT: " + content);
			content = JSON.parse(content);
			
			response.headers.statusCode = response.statusCode.toString();
			trace && trace("=========== Web Service call result ============");
			trace && trace("Headers    :" + JSON.stringify(response.headers, null, 2));
			trace && trace("Body       : " + JSON.stringify(content, null, 2));
			trace && trace("================================================");

			return {
				statusCode: response.statusCode,
				header: response.headers,
				body: content
			};
		},
	},
	$services: {
		get: {
			$method: "GET",
			$isMethod: true,
			$title: "Test POST",
			$execute: function(_, context, instance) {
				instance.$diagnoses = instance.$diagnoses || [];
				try {
					var res = instance.execRequest(_, "POST", "/test", null, {"test": "ok"});
					if (res.statusCode === 200) {
						instance.$diagnoses.push({
							$severity: "info",
							$message: "OK"
						});
					} else {
						instance.$diagnoses.push({
							$severity: "error",
							$message: res.statusCode + ": " + http.STATUS_CODES[res.statusCode]
						});
					}

				} catch (e) {
					console.log(e.stack);
					instance.$diagnoses.push({
						$severity: "error",
						$message: "" + e,
						$stackTrace: e.safeStack
					});
				}
			}
		},
	},
	$events: {},
};
