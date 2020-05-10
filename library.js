'use strict';

const controllers = require('./lib/controllers');
const categories = module.parent.require('./categories');
const helper = module.parent.require('./controllers/helpers');
const modulesSockets = module.parent.require('./socket.io/modules');
const topics = module.parent.require('./topics');
const user = module.parent.require('./user')
const plugin = {};
const position = require('./lib/positionData.js');
plugin.db = require.main.require('./src/database');
plugin.topicData = [];
plugin.init = function (params, callback) {
	const router = params.router;
	const hostMiddleware = params.middleware;
	// const hostControllers = params.controllers;

	// We create two routes for every view. One API call, and the actual route itself.
	// Just add the buildHeader middleware to your route and NodeBB will take care of everything for you.

	router.get('/admin/plugins/quickstart', hostMiddleware.admin.buildHeader, controllers.renderAdminPage);
	router.get('/pin-preview',
		checkAdminAndModMiddleware,
		pinPreviewMiddleware,
		hostMiddleware.buildHeader,
		controllers.renderPinChoosePage);

	router.get('/api/admin/plugins/quickstart', controllers.renderAdminPage);

	modulesSockets.renderPinChoose = function (socket, data, callback) {
		params.app.render('pinChoose', position.buttonsData, function (err, html) {
			callback(null, html);
		})
	}
	modulesSockets.submitPin = function (socket, data, callback) {
		// plugin.db.sortedSetAdd('users:reputationnn', 200, "127.0.0.0.1"); //score value
		// plugin.db.sortedSetAdd('users:reputationnn', 200, "127.0.0.0.2");
		var obj = plugin.db.setObject(data.key, { "tid": data.tid });
		callback(null, null);
	}
	modulesSockets.getTopicsToPin = function (socket, data, callback) {
		var sort = data.sort;
		var catgory = data.category;
		var name = data.name;
		var dataSort = plugin.topicData;
		//sort
		//Newest is default
		dataSort = dataSort.sort((a, b) => { return b.tid - a.tid });
		if (sort == "oldest")
			dataSort = dataSort.sort((a, b) => { return a.tid - b.tid });
		if (sort == "mostviewed")
			dataSort = dataSort.sort((a, b) => { return b.viewcount - a.viewcount });
		if (sort == "mostliked")
			dataSort = dataSort.sort((a, b) => { return b.upvotes - a.upvotes });

		//category
		var dataFiltered = dataSort
		if (catgory != '0')
			dataFiltered = dataSort.filter(i => i.cid == catgory);
		//name
		var dataFilterName = dataFiltered.filter(i => i.title.toLowerCase().includes(name.toLowerCase()))

		params.app.render('pinPreview/dataContainer', { topics: dataFilterName }, function (err, html) {
			callback(null, html);
		})
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
var pinPreviewMiddleware = async function (req, res, next) {
	var cids = req.modOfCids.map(i => "cid:" + i + ":tids");
	var keys = await plugin.db.client.collection('objects').find({ _key: { $in: cids } }).toArray(); //Get all tids in cids
	var tids = keys.map(i => i.value); //Only get tids
	var querryDatas = await topics.getTopicsByTids(tids, 1); //Get 
	var modOfCateories = await categories.getCategories(req.modOfCids, req.uid);
	req.modOfCateories = modOfCateories;
	plugin.topicData = querryDatas;
	// console.log(plugin.topicData);
	// console.log(plugin.modOfCateories);
	next();
}
var checkAdminAndModMiddleware = async function (req, res, next) {
	req.isAdmin = await user.isAdministrator(req.uid);
	req.isGlobalMod = await user.isGlobalModerator(req.uid);
	req.isMod = false;
	var topicIds = await plugin.db.client
		.collection('objects')
		.find({ _key: "categories:cid" })
		.toArray();
	var topicQuerryKeys = topicIds.map(i => "group:cid:" + i.value + ":privileges:moderate:members");
	// console.log(topicIds);
	var categoriesMod = await plugin.db.client
		.collection('objects')
		.find({ _key: { $in: topicQuerryKeys }, value: req.uid + "" })
		.toArray();
	var categoriesModKeys = categoriesMod.map(i => i._key.split(":")[2]);
	// console.log(categoriesMod);
	if (categoriesMod.length > 0) {
		req.isMod = true;
	}
	req.modOfCids = categoriesModKeys;
	if (req.isAdmin == true || req.isAdmin == true) {
		req.modOfCids = topicIds.map(i => i.value);
	}
	if (req.isAdmin == req.isGlobalMod == req.isMod == false) {
		return helper.notAllowed(req, res);
	}
	// console.log(req);
	next();
}
module.exports = plugin;
