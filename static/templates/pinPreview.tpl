<div class="container" id="pinPreview">
    <h1>
        [[pindealbee:pinpreview-title]]
    </h1>
    <div class="container filter">
        <div class="row">
            <div class="col-xs-3">
                <label for="filter-dropbox">[[pindealbee:pinpreview-sorted]]</label>
            </div>
            <div class="col-xs-3">
                <label for="filter-categories-dropbox">[[pindealbee:pinpreview-filtered]]</label>
            </div>
            <div class="col-xs-3">
                <label for="filter-name-input">[[pindealbee:pinpreview-matched]]</label>
            </div>
            <div class="col-xs-3">

            </div>
        </div>
        <div class="row">
            <div class="col-xs-3">
                <select id="filter-dropbox" class="form-control">
                    <option value="newest" selected>[[pindealbee:pinpreview-filtered-newest]]</option>
                    <option value="oldest">[[pindealbee:pinpreview-filtered-oldest]]</option>
                    <option value="mostviewed">[[pindealbee:pinpreview-filtered-most-viewd]]</option>
                    <option value="mostliked">[[pindealbee:pinpreview-filtered-most-liked]]</option>
                </select>
            </div>
            <div class="col-xs-3">
                <select id="filter-categories-dropbox" class="form-control">
                    <!-- BEGIN categories -->
                    <option value={categories.cid} data-cid={categories.cid}>
                        {categories.name}
                    </option>
                    <!-- END categories -->
                    <option value=0 data-cid=0 selected>
                    [[pindealbee:pinpreview-sorted-all]]
                    </option>
                </select>
            </div>
            <div class="col-xs-3">
                <input class="form-control" type="text" placeholder="[[pindealbee:pinpreview-matched-placeholder]]" id="filter-name-input">
            </div>
            <div class="col-xs-3">
                <button class="btn btn-primary" id="querryBtn">[[pindealbee:pinpreview-query]]</button>
            </div>
        </div>
    </div>
    <div class="container data" id="data-container">
    </div>

    <div id="pagination" data-total = {total}>

    </div>
    <a href="" target="_blank" class="btn btn-success" id="page-preview-btn">
        <i class="fa fa-2x fa-eye"></i>
    </a>
</div>