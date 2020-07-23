'use strict';

var Controllers = {};

Controllers.renderAdminPage = function (req, res/* , next */) {
	/*
		Make sure the route matches your path to template exactly.

		If your route was:
			myforum.com/some/complex/route/
		your template should be:
			templates/some/complex/route.tpl
		and you would render it like so:
			res.render('some/complex/route');
	*/

	res.render('admin/plugins/quickstart');
};
Controllers.renderPinChoosePage = function (req, res) {
	return res.render('pinPreview.tpl', { categories: req.modOfCateories, title: '[[pindealbee:title-pin-choose]]' });
};
Controllers.renderPreviewPage = function(req, res){
	// console.log("Rendering...")
	// console.log(req.positionData.areas);
	return res.render('pagePreview.tpl', {  areas: req.positionData.areas, title: '[[pindealbee:title-page-preview]]' });
}
Controllers.renderFrontPage = function(req, res){
	return res.render('frontPage.tpl',{title: "Font page"});
}
module.exports = Controllers;
