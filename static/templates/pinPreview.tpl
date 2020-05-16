<div class="container" id="pinPreview">
    <h1>
        Preview page to pin posts to Dealbee
    </h1>
    <div class="container filter">
        <div class="row">
            <div class="col-md-3">
                <label for="filter-dropbox">Sorted by:</label>
            </div>
            <div class="col-md-3">
                <label for="filter-categories-dropbox">Filtered by catrgory:</label>
            </div>
            <div class="col-md-3">
                <label for="filter-name-input">Matched by name</label>
            </div>
            <div class="col-md-3">

            </div>
        </div>
        <div class="row">
            <div class="col-md-3">
                <select id="filter-dropbox" class="form-control">
                    <option value="newest" selected>Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="mostviewed">Most viewed</option>
                    <option value="mostliked">Most liked</option>
                </select>
            </div>
            <div class="col-md-3">
                <select id="filter-categories-dropbox" class="form-control">
                    <!-- BEGIN categories -->
                    <option value={categories.cid} data-cid={categories.cid}>
                        {categories.name}
                    </option>
                    <!-- END categories -->
                    <option value=0 data-cid=0 selected>
                        All
                    </option>
                </select>
            </div>
            <div class="col-md-3">
                <input class="form-control" type="text" placeholder="Topic name" id="filter-name-input">
            </div>
            <div class="col-md-3">
                <button class="btn btn-primary" id="querryBtn">Query</button>
            </div>
        </div>
    </div>
    <div class="container data" id="data-container">
    </div>
</div>