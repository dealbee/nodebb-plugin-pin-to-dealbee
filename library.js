'use strict';

const controllers = require('./lib/controllers');
const categories = require.main.require('./src/categories');
const groups = require.main.require('./src/groups');
const helper = require.main.require('./src/controllers/helpers');
const modulesSockets = module.parent.require('./socket.io/modules');
const topics = require.main.require('./src/topics');
const user = require.main.require('./src/user');
const plugin = {};
const position = require('./lib/positionData.json');
const async = module.parent.require('async');
const privilegeNames = {
    canPin: 'pindealbee:event:pin'
};
const socketIndex = module.parent.require('./socket.io/index');
const moment = require('./lib/moment');
plugin.db = require.main.require('./src/database');
plugin.topicData = [];
plugin.init = function (params, callback) {
    const router = params.router;
    const hostMiddleware = params.middleware;
    router.get('/pindealbee',
        checkAdminAndModMiddleware,
        pinPreviewMiddleware,
        hostMiddleware.buildHeader,
        controllers.renderPinChoosePage
    );
    router.get('/pindealbee/preview', checkAdminAndModMiddleware, pagePreviewMiddleware, hostMiddleware.buildHeader, controllers.renderPreviewPage)
    router.get('/admin/plugins/pin-to-dealbee', hostMiddleware.admin.buildHeader, controllers.renderAdminPage);
    router.get('/api/admin/plugins/pin-to-dealbee', controllers.renderAdminPage);
    router.post('/pindealbee', async function (req, res) {
        // console.log(req.body)
        if (!req.body.option)
            res.status(400).send({message: "option is required"})
        else if (req.body.option == 'can-pin') {
            var isAdmin = await user.isAdministrator(req.uid);
            var cids = await plugin.canPinCids(req.uid);
            if (cids.length == 0 && !isAdmin) {
                res.status(400).send({message: "No permission"})
            } else {
                res.status(200).send({message: "Have permission"})
            }
        } else if (req.body.option == 'render-pin-choose') {
            params.app.render('pinChoose', position, function (err, html) {
                res.status(200).send(html);
            });
        } else if (req.body.option == 'submit-pin') {
            let deleteExit = await plugin.db.client.collection('objects').deleteMany({
                _key: /pindealbee:/,
                tid: parseInt(req.body.tid)
            });
            let typeId = req.body.key.split(":")[1];
            let topics = await plugin.db.client.collection('objects').find({_key: {$regex: `pindealbee:${typeId}:`}}).toArray();
            topics = topics.map(e => {
                return e.tid;
            })
            await plugin.db.client.collection('objects').deleteMany({_key: {$regex: `pindealbee:${typeId}:`}});
            let tids = [parseInt(req.body.tid), ...topics];
            let posistionIds = position.areas.find(x => x.id === typeId).positions.map(e => {
                return e.id;
            })
            try {
                if (posistionIds.length >= tids.length) {
                    plugin.asyncForEach(tids, async (tid, i) => {
                        await plugin.db.setObject(`pindealbee:${typeId}:${posistionIds[i]}`, {tid: tid});
                    })
                } else {
                    plugin.asyncForEach(posistionIds, async (positionId, i) => {
                        await plugin.db.setObject(`pindealbee:${typeId}:${positionId}`, {tid: tids[i]});
                    })
                }
            } catch (e) {
                return res.status(400).send({message: e});
            }
            return res.status(200).send({message: 'pin successfully'});
        } else if (req.body.option == 'get-topics-to-pin') {
            var sort = req.body.sort;
            var catgory = req.body.category;
            var name = req.body.name;
            var dataSort = plugin.topicData;
            // sort
            // Newest is default
            dataSort = dataSort.sort((a, b) => b.tid - a.tid);
            if (sort == 'oldest') {
                dataSort = dataSort.sort((a, b) => a.tid - b.tid);
            }
            if (sort == 'mostviewed') {
                dataSort = dataSort.sort((a, b) => b.viewcount - a.viewcount);
            }
            if (sort == 'mostliked') {
                dataSort = dataSort.sort((a, b) => b.upvotes - a.upvotes);
            }

            // category
            var dataFiltered = dataSort;
            if (catgory != '0') {
                dataFiltered = dataSort.filter(i => i.cid == catgory);
            }
            // name
            var dataFilterName = dataFiltered.filter(i => i.title.toLowerCase().includes(name.toLowerCase()));
            dataFilterName.map(e => {
                if (!e.lastposttimeISOFormat)
                    e.lastposttimeISOFormat = moment.utc(e.lastposttimeISO).format('HH:mm DD-MM-YYYY')
                if (!e.timestampISOFormat)
                    e.timestampISOFormat = moment.utc(e.timestampISO).format('HH:mm DD-MM-YYYY')
                return e;
            })
            params.app.render('pinPreview/dataContainer', {topics: dataFilterName}, function (err, html) {
                res.status(200).send(html);
            });
        } else {
            res.status(400).send({message: "No command found"})
        }
    })
    router.delete('/pindealbee/unpin/:id/:tid', checkAdminAndModMiddleware, async function (req, res) {
        var topicCid = await topics.getTopicField(req.params.tid, ['cid']);
        var canUnpin = req.modOfCids.find(e => e == topicCid.toString());
        if (!canUnpin) {
            return res.status(400).send({message: "No have permisson"});
        }
        var obj = await plugin.db.client.collection('objects').deleteOne({
            _key: req.params.id,
            tid: parseInt(req.params.tid)
        });
        if (obj.deletedCount == 1)
            res.status(200).send({message: "Unpin post at position " + req.params.id + " successfully"})
        else
            res.status(400).send({message: "Fail to unpin"});
    })
    router.post('/pindealbee/preview/update-view', checkAdminAndModMiddleware, pagePreviewMiddleware, function (req, res) {
        params.app.render('pagePreview.tpl', {areas: req.positionData.areas}, function (err, html) {
            res.status(200).send(html);
        });
    })
    modulesSockets.getTopics = function (socket, data, callback) {
        let topics = [];
        let total = 0;
        async.waterfall([
            async function (next) {
                let sort = {};
                let match = null;
                let isAdmin = await user.isAdministrator(socket.uid)
                let keyTopic ={};
                if (isAdmin){
                    keyTopic = {_key: /^topic:/}
                }else{
                    let canPinCid = await plugin.canPinCids(socket.uid);
                    canPinCid = [...canPinCid, ... canPinCid.map(e=>parseInt(e))]
                    keyTopic = {_key: /^topic:/, cid: {$in: canPinCid}}
                }
                if (data.nameOp) {
                    match = {
                        $and:
                            [
                                {
                                    $text: {
                                        $search: data.nameOp,
                                        $caseSensitive: false
                                    }
                                },
                                {... keyTopic},
                                {_key: {$not: /tags/}},
                                {locked: {$ne: 1}},
                                {deleted: {$ne: 1}}
                            ]
                    };
                } else {
                    match = {
                        $and:
                            [
                                {... keyTopic},
                                {_key: {$not: /tags/}},
                                {locked: {$ne: 1}},
                                {deleted: {$ne: 1}}
                            ]
                    };
                }
                let limit = data.limit;
                let skip = data.skip;
                //sort
                if (data.sortedOp === 'oldest') {
                    sort.timestamp = 1;
                } else if (data.sortedOp === 'mostviewed') {
                    sort.viewcount = -1;
                } else if (data.sortedOp === 'mostliked') {
                    sort.upvotes = -1;
                } else {
                    sort.timestamp = -1;
                }
                //cid
                if (data.categoryOp !== '0') {
                    match.$and.push({
                        $or:
                            [
                                {cid: parseInt(data.categoryOp)},
                                {cid: data.categoryOp},
                            ]
                    })
                }
                topics = await plugin.db.client.collection('objects').aggregate([
                    {$match: match},
                    {
                        $addFields:
                            {
                                categoryKey: {
                                    $concat: ['category:', {$toLower: '$cid'}]
                                }
                            }
                    },
                    {
                        $lookup: {
                            from: 'objects',
                            localField: 'categoryKey',
                            foreignField: '_key',
                            as: 'category'
                        }
                    },
                    {$sort: sort},
                    {$skip: skip},
                    {$limit: limit}
                ]).toArray();
                total = await plugin.db.client.collection('objects').aggregate([
                    {
                        $addFields:
                            {
                                titleUpper: {
                                    $toUpper: "$title"
                                },
                                categoryKey: {
                                    $concat: ['category:', {$toLower: '$cid'}]
                                }
                            }
                    },
                    {
                        $lookup: {
                            from: 'objects',
                            localField: 'categoryKey',
                            foreignField: '_key',
                            as: 'category'
                        }
                    },
                    {$match: match},
                    {$count: "total"}
                ]).toArray();
                if (total.length === 0) {
                    total = 0;
                } else {
                    total = total[0].total;
                }
                next(null, null)
            }
        ], function (err, res) {
            topics.map(e => {
                if (!e.lastposttimeISOFormat)
                    e.lastposttimeISOFormat = moment(e.lastposttime).format('HH:mm DD-MM-YYYY')
                if (!e.timestampISOFormat)
                    e.timestampISOFormat = moment(e.timestamp).format('HH:mm DD-MM-YYYY')
                e.category = e.category[0];
                if (!e.upvotes) {
                    e.upvotes = 0;
                }
                delete e.categoryKey;
                return e;
            })
            params.app.render('pinPreview/dataContainer', {topics, total}, function (err, html) {
                callback(err, html);
            });
        });
    }
    modulesSockets.pindealbeePin = function (socket, data, callback) {
        socketIndex.server.sockets.emit('pin-post', data);
    };
    modulesSockets.pindealbeeUnpin = function (socket, data, callback) {
        // socket.broadcast.emit('unpin-post',data)
        socketIndex.server.sockets.emit('unpin-post', data);
    };
    callback();
};
plugin.addListing = function (data, callback) {
    data.routes.push({
        route: 'front-page',
        name: 'Dealbee Front Page'
    });
    callback(null, data);
};
plugin.serveFrontPage = async function (params) {
    params.res.render('frontPage', {
        template: {
            name: 'frontPage'
        },
        topics: await plugin.getPinnedTiopics(),
        categories: await plugin.getCategories()
    });
}
plugin.defineWidgetAreas = function (areas, callback) {
    areas = areas.concat([
        {
            'name': 'Dealbee Front Page Header',
            'template': 'frontPage.tpl',
            'location': 'hp-header'
        },
        {
            'name': 'Dealbee Front Page Footer',
            'template': 'frontPage.tpl',
            'location': 'hp-footer'
        },
        {
            'name': 'Dealbee Front Page Sidebar',
            'template': 'frontPage.tpl',
            'location': 'hp-sidebar'
        },
        {
            'name': 'Dealbee Front Page Content',
            'template': 'frontPage.tpl',
            'location': 'hp-content'
        }
    ]);

    callback(null, areas);
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
    var keys = await plugin.db.client.collection('objects').find({_key: {$in: cids}}).toArray(); // Get all tids in cids
    var tids = keys.map(i => i.value); // Only get tids
    var querryDatas = await topics.getTopicsByTids(tids, 1); // Get
    var modOfCateories = await categories.getCategories(req.modOfCids, req.uid);
    req.modOfCateories = modOfCateories;
    plugin.topicData = querryDatas;
    next();
};
var checkAdminAndModMiddleware = async function (req, res, next) {
    req.isAdmin = await user.isAdministrator(req.uid);
    var topicIds = await plugin.db.client
        .collection('objects')
        .find({_key: 'categories:cid'})
        .toArray();
    if (req.isAdmin == true) {
        req.modOfCids = topicIds.map(i => i.value).sort((a, b) => a - b);
        next();
    } else {
        var cids = await plugin.canPinCids(req.uid);
        if (cids.length == 0) {
            return helper.notAllowed(req, res);
        }
        req.modOfCids = cids.sort((a, b) => a - b)
        next();
    }
}
var pagePreviewMiddleware = async function (req, res, next) {
    var positionData = position;
    var positionKeys = []
    positionData.areas.map(e => e.positions.map(i => {
        i._key = "pindealbee:" + e.id + ":" + i.id;
        positionKeys.push(i._key);
        return i;
    }))
    var postionTids = await plugin.db.client.collection('objects').find({_key: {$in: positionKeys}}).toArray();
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
        } else {
            i.canEdit = false
        }
    })
    postionTids.map(e => {
        e.topicData = topicsData.find(i => {
            return i.tid == e.tid
        })
        return e;
    })
    positionData.areas.map(e => e.positions.map(i => {
        var tData = postionTids.find(k => {
            return k._key == i._key
        })
        if (!tData) {
            i.topicData = null
        } else {
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
    let groupsData = await plugin.db.client.collection('objects').find({_key: /privileges:groups:pindealbee:event:pin:members/}).toArray();
    //Get users data that have privilige to pin to dealbee
    let users = await plugin.db.client.collection('objects').find({_key: /privileges:pindealbee:event:pin:members/}).toArray();
    //Get groups' name
    let groupNames = [];
    groupsData.forEach(e => groupNames.push(e.value));
    //Get array of boolean determining user is in group
    let usersInGroup = await groups.isMemberOfGroups(uid, groupNames)
    let privilegeId = [];
    groupsData.forEach((e, i) => {
        if (usersInGroup[i] === true) {
            privilegeId.push(e._key);
        }
    })
    users.forEach(e => {
        if (e.value === uid.toString()) {
            privilegeId.push(e._key);
        }
    })
    let cids = privilegeId.map(e => e = e.split(":")[2]);
    let categories = await plugin.db.client.collection('objects').find({_key: /^category:/}).toArray();
    await plugin.asyncForEach(categories, async (category, i)=>{
        let isMod  = await user.isModerator(uid, category.cid);
        if (isMod){
            cids.push(category.cid.toString())
        }
    })
    cids = [...new Set(cids)];
    return cids;
}
plugin.asyncForEach = async function (array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}
plugin.getPinnedTiopics = async function () {
    let topics = await plugin.db.client.collection('objects')
        .aggregate([
            {
                $addFields: {
                    topicKey: {
                        $concat: ['topic:', {$toLower: '$tid'}]
                    }
                }
            },
            {
                $lookup: {
                    from: 'objects',
                    localField: 'topicKey',
                    foreignField: '_key',
                    as: 'topic'
                }
            },
            {
                $unwind: '$topic'
            },
            {
                $addFields: {
                    categoryKey: {
                        $concat: ['category:', {$toLower: '$topic.cid'}]
                    }
                }
            },
            {
                $lookup: {
                    from: 'objects',
                    localField: 'categoryKey',
                    foreignField: '_key',
                    as: 'category'
                }
            },
            {
                $unwind: '$category'
            },
            {
                $addFields: {
                    categoryName: '$category.name'
                }
            },
            {
                $match: {_key: /^pindealbee/}
            },
            {
                $sort: {
                    _key: 1
                }
            }
        ]).toArray()
    topics.forEach(topic => {
        topic.topic.currency = topic.topic.currency.split(' - ')[0];
        topic.topic.postcount--;
        if (topic.topic.price)
            topic.topic.price = topic.topic.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        if (topic.topic.discountPrice)
            topic.topic.discountPrice = topic.topic.discountPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    })
    return topics;
}
plugin.getCategories = async function () {
    let categories = await plugin.db.client.collection('objects').find({_key: /^category:/}).toArray();
    categories = categories.sort((a, b) => a.name > b.name);
    return categories;
}
module.exports = plugin;
