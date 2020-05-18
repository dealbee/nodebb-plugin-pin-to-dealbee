'use strict';

const controllers = require('./lib/controllers');
const categories = require.main.require('./src/categories');
const groups = require.main.require('./src/groups');
const helper = require.main.require('./src/controllers/helpers');
const modulesSockets = module.parent.require('./socket.io/modules');
const topics = require.main.require('./src/topics');
const user = require.main.require('./src/user');
const plugin = {};
const position = require('./lib/positionData.js');
const privilegeNames = {
	canPin: 'pindealbee:event:pin'
};
const socketIndex = module.parent.require('./socket.io/index');
plugin.db = require.main.require('./src/database');
plugin.topicData = [];
plugin.init = function (params, callback) {
	const router = params.router;
	const hostMiddleware = params.middleware;
	// const hostControllers = params.controllers;

	// We create two routes for every view. One API call, and the actual route itself.
	// Just add the buildHeader middleware to your route and NodeBB will take care of everything for you.
	router.get('/pindealbee',
		checkAdminAndModMiddleware,
		pinPreviewMiddleware,
		hostMiddleware.buildHeader,
		// controllers.renderAdminPage,
		controllers.renderPinChoosePage
	);
	router.get('/pindealbee/preview', checkAdminAndModMiddleware, pagePreviewMiddleware, hostMiddleware.buildHeader, controllers.renderPreviewPage)
	router.get('/admin/plugins/pin-to-dealbee', hostMiddleware.admin.buildHeader, controllers.renderAdminPage);
	router.get('/api/admin/plugins/pin-to-dealbee', controllers.renderAdminPage);
	router.post('/pindealbee', async function (req, res) {
		// console.log(req.body)
		if (!req.body.option)
			res.status(400).send({ message: "option is required" })
		else if (req.body.option == 'can-pin') {
			var cids = await plugin.canPinCids(req.uid);
			if (cids.length == 0) {
				res.status(400).send({ message: "No permission" })
			}
			else {
				res.status(200).send({ message: "Have permission" })
			}
		}
		else if (req.body.option == 'render-pin-choose') {
			params.app.render('pinChoose', position.buttonsData, function (err, html) {
				res.status(200).send(html);
			});
		}
		else if (req.body.option == 'submit-pin') {
			var obj = await plugin.db.setObject(req.body.key, { tid: parseInt(req.body.tid) });
			res.status(200).send(obj);
		}
		else if (req.body.option == 'get-topics-to-pin') {
			var sort = req.body.sort;
			var catgory = req.body.category;
			var name = req.body.name;
			var dataSort = plugin.topicData;
			// sort
			// Newest is default
			dataSort = dataSort.sort((a, b) => b.tid - a.tid);
			if (sort == 'oldest') { dataSort = dataSort.sort((a, b) => a.tid - b.tid); }
			if (sort == 'mostviewed') { dataSort = dataSort.sort((a, b) => b.viewcount - a.viewcount); }
			if (sort == 'mostliked') { dataSort = dataSort.sort((a, b) => b.upvotes - a.upvotes); }

			// category
			var dataFiltered = dataSort;
			if (catgory != '0') { dataFiltered = dataSort.filter(i => i.cid == catgory); }
			// name
			var dataFilterName = dataFiltered.filter(i => i.title.toLowerCase().includes(name.toLowerCase()));
			params.app.render('pinPreview/dataContainer', { topics: dataFilterName }, function (err, html) {
				res.status(200).send(html);
			});
		}
		else {
			res.status(400).send({ message: "No command found" })
		}
	})
	router.delete('/pindealbee/unpin/:id/:tid', checkAdminAndModMiddleware, async function (req, res) {
		var topicCid = await topics.getTopicField(req.params.tid, ['cid']);
		var canUnpin = req.modOfCids.find(e => e == topicCid.toString());
		if (!canUnpin) {
			return res.status(400).send({ message: "No have permisson" });
		}
		var obj = await plugin.db.client.collection('objects').deleteOne({ _key: req.params.id, tid: parseInt(req.params.tid) });
		if (obj.deletedCount == 1)
			res.status(200).send({ message: "Unpin post at position " + req.params.id + " successfully" })
		else
			res.status(400).send({ message: "Fail to unpin" });
	})
	router.post('/pindealbee/preview/update-view', checkAdminAndModMiddleware, pagePreviewMiddleware, function(req,res){
		params.app.render('pagePreview.tpl', { positionTypes: req.positionData.positionTypes},function(err, html){
			res.status(200).send(html);
		});
	})
	modulesSockets.pindealbeePin = function (socket, data, callback) {
		socketIndex.server.sockets.emit('pin-post',data);
	};
	modulesSockets.pindealbeeUnpin = function (socket, data, callback) {
		// socket.broadcast.emit('unpin-post',data)
		socketIndex.server.sockets.emit('unpin-post',data);
	};
	// modulesSockets.submitPin = function (socket, data, callback) {
	// 	// plugin.db.sortedSetAdd('users:reputationnn', 200, "127.0.0.0.1"); //score value
	// 	// plugin.db.sortedSetAdd('users:reputationnn', 200, "127.0.0.0.2");
	// 	var obj = plugin.db.setObject(data.key, { tid: data.tid });
	// 	callback(null, null);
	// };
	// modulesSockets.getTopicsToPin = function (socket, data, callback) {
	// 	var sort = data.sort;
	// 	var catgory = data.category;
	// 	var name = data.name;
	// 	var dataSort = plugin.topicData;
	// 	// sort
	// 	// Newest is default
	// 	dataSort = dataSort.sort((a, b) => b.tid - a.tid);
	// 	if (sort == 'oldest') { dataSort = dataSort.sort((a, b) => a.tid - b.tid); }
	// 	if (sort == 'mostviewed') { dataSort = dataSort.sort((a, b) => b.viewcount - a.viewcount); }
	// 	if (sort == 'mostliked') { dataSort = dataSort.sort((a, b) => b.upvotes - a.upvotes); }

	// 	// category
	// 	var dataFiltered = dataSort;
	// 	if (catgory != '0') { dataFiltered = dataSort.filter(i => i.cid == catgory); }
	// 	// name
	// 	var dataFilterName = dataFiltered.filter(i => i.title.toLowerCase().includes(name.toLowerCase()));
	// 	params.app.render('pinPreview/dataContainer', { topics: dataFilterName }, function (err, html) {
	// 		console.log(err)
	// 		console.log(html)
	// 		callback(null, html);
	// 	});
	// };
	callback();
};

plugin.addAdminNavigation = function (header, callback) {
	header.plugins.push({
		route: '/plugins/pin-to-dealbee',
		icon: 'fa-tint',
		name: 'Pin to dealbee',
	});

	callback(null, header);
};
plugin.topicBuild = function (data, callback) {
	callback(null, data);
};
var pinPreviewMiddleware = async function (req, res, next) {
	var cids = req.modOfCids.map(i => 'cid:' + i + ':tids');
	var keys = await plugin.db.client.collection('objects').find({ _key: { $in: cids } }).toArray(); // Get all tids in cids
	var tids = keys.map(i => i.value); // Only get tids
	var querryDatas = await topics.getTopicsByTids(tids, 1); // Get
	var modOfCateories = await categories.getCategories(req.modOfCids, req.uid);
	req.modOfCateories = modOfCateories;
	plugin.topicData = querryDatas;
	// console.log(plugin.topicData);
	// console.log(plugin.modOfCateories);
	next();
};
// var checkAdminAndModMiddleware = async function (req, res, next) {
// 	req.isAdmin = await user.isAdministrator(req.uid);
// 	req.isGlobalMod = await user.isGlobalModerator(req.uid);
// 	req.isMod = false;
// 	var topicIds = await plugin.db.client
// 		.collection('objects')
// 		.find({ _key: 'categories:cid' })
// 		.toArray();
// 	var topicQuerryKeys = topicIds.map(i => 'group:cid:' + i.value + ':privileges:moderate:members');
// 	// console.log(topicIds);
// 	var categoriesMod = await plugin.db.client
// 		.collection('objects')
// 		.find({ _key: { $in: topicQuerryKeys }, value: req.uid + '' })
// 		.toArray();
// 	var categoriesModKeys = categoriesMod.map(i => i._key.split(':')[2]);
// 	// console.log(categoriesMod);
// 	if (categoriesMod.length > 0) {
// 		req.isMod = true;
// 	}
// 	req.modOfCids = categoriesModKeys;
// 	if (req.isAdmin == true || req.isAdmin == true) {
// 		req.modOfCids = topicIds.map(i => i.value);
// 	}
// 	if (req.isAdmin == req.isGlobalMod == req.isMod == false) {
// 		return helper.notAllowed(req, res);
// 	}
// 	// console.log(req);
// 	next();
// };
var checkAdminAndModMiddleware = async function (req, res, next) {
	req.isAdmin = await user.isAdministrator(req.uid);
	var topicIds = await plugin.db.client
		.collection('objects')
		.find({ _key: 'categories:cid' })
		.toArray();
	if (req.isAdmin == true) {
		req.modOfCids = topicIds.map(i => i.value).sort((a, b) => a - b);
		next();
	}
	else {
		var cids = await plugin.canPinCids(req.uid);
		if (cids.length == 0) {
			return helper.notAllowed(req, res);
		}
		req.modOfCids = cids.sort((a, b) => a - b)
		next();
	}
}
var pagePreviewMiddleware = async function (req, res, next) {
	var positionData = position.buttonsData;
	var positionKeys = []
	positionData.positionTypes.map(e => e.positions.map(i => {
		i._key = "pindealbee:" + e.id + ":" + i.id;
		positionKeys.push(i._key);
		return i;
	}))
	var postionTids = await plugin.db.client.collection('objects').find({ _key: { $in: positionKeys } }).toArray();
	var tids = [];
	postionTids.forEach(e => tids.push(e.tid));
	tids = [...new Set(tids)]
	// console.log(tids);
	var topicsData = await topics.getTopicsByTids(tids, 1);
	var cids = req.modOfCids;
	cids = cids.map(i => parseInt(i));
	topicsData.map(i => {
		var match = cids.find(e => {
			return e == i.cid;
		})
		if (match) {
			i.canEdit = true
		}
		else {
			i.canEdit = false
		}
	})
	postionTids.map(e => {
		e.topicData = topicsData.find(i => {
			return i.tid == e.tid
		})
		return e;
	})
	positionData.positionTypes.map(e => e.positions.map(i => {
		var tData = postionTids.find(k => {
			return k._key == i._key
		})
		if (!tData) {
			i.topicData = null
		}
		else {
			i.topicData = tData.topicData;
		}
		return i;
	}))
	req.positionData = positionData;
	next();
}
plugin.privilegesList = function (list, callback) {
	callback(null, [...list, ...Object.values(privilegeNames)]);
}
plugin.privilegesGroupsList = function (list, callback) {
	callback(null, [...list, ...Object.values(privilegeNames).map(name => `groups:${name}`)]);
}

plugin.privilegesListHuman = function (list, callback) {
	callback(null, [...list, {
		name: 'Pin to dealbee'
	}]);
}
plugin.canPinCids = async function (uid) {
	//Get groups data that have privilige to pin to dealbee
	var groupsData = await plugin.db.client.collection('objects').find({ _key: /privileges:groups:pindealbee:event:pin:members/ }).toArray();
	//Get users data that have privilige to pin to dealbee
	var users = await plugin.db.client.collection('objects').find({ _key: /privileges:pindealbee:event:pin:members/ }).toArray();
	//Get groups' name
	var groupNames = [];
	groupsData.forEach(e => groupNames.push(e.value));
	//Get array of boolean determining user is in group
	var usersInGroup = await groups.isMemberOfGroups(uid, groupNames)
	var privilegeId = [];
	groupsData.forEach((e, i) => {
		if (usersInGroup[i] == true) {
			privilegeId.push(e._key);
		}
	})
	users.forEach(e => {
		if (e.value == uid.toString()) {
			privilegeId.push(e._key);
		}
	})
	var cids = privilegeId.map(e => e = e.split(":")[2]);
	cids = [...new Set(cids)];
	return cids;
}
module.exports = plugin;
