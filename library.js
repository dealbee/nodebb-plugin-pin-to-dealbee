'use strict';

const controllers = require('./lib/controllers');
const modulesSockets = module.parent.require('./socket.io/modules');
var topics = module.parent.require('./topics');
const plugin = {};
const position = require('./lib/positionData.js');
plugin.db = require.main.require('./src/database');
plugin.init = function (params, callback) {
	const router = params.router;
	const hostMiddleware = params.middleware;
	// const hostControllers = params.controllers;

	// We create two routes for every view. One API call, and the actual route itself.
	// Just add the buildHeader middleware to your route and NodeBB will take care of everything for you.

	router.get('/admin/plugins/quickstart', hostMiddleware.admin.buildHeader, controllers.renderAdminPage);
	router.get('/api/admin/plugins/quickstart', controllers.renderAdminPage);

	modulesSockets.renderPinPreview = function (socket, data, callback) {
		params.app.render('mytemplate',position.buttonsData, function (err, html) {
			callback(null, html);
		})
	}
	modulesSockets.submitPin = function (socket, data, callback) {
		// plugin.db.sortedSetAdd('users:reputationnn', 200, "127.0.0.0.1"); //score value
		// plugin.db.sortedSetAdd('users:reputationnn', 200, "127.0.0.0.2");
		var obj =  plugin.db.setObject(data.key, { "tid":data.tid});
		callback(null,null);
	}
	callback();
};

plugin.addAdminNavigation = function (header, callback) {
	header.plugins.push({
		route: '/plugins/quickstart',
		icon: 'fa-tint',
		name: 'Quickstart',
	});

	callback(null, header);
};
plugin.topicBuild = function (data, callback) {
	callback(null, data);
}
module.exports = plugin;
