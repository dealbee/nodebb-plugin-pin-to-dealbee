<div class="container" id="pagePreview">
    <h1>[[pindealbee:pagepreview-title]]</h1>
    <!-- BEGIN positionTypes -->
    <h2 class="position-type">{positionTypes.positionName}</h2>
    <div class="row">
        <!-- BEGIN positionTypes.positions -->
        <div class="col-md-3">
            <!-- IF positionTypes.positions.topicData -->
            <div class="card">
                <!-- IF positionTypes.positions.topicData.canEdit -->
                <span class="pull-right">
                    <i class="fa fa-trash unpin-btn" data-typeid={positionTypes.id} data-posid={positionTypes.positions.id} data-tid={positionTypes.positions.topicData.tid}>
                    </i>
                </span>
                <!-- ENDIF positionTypes.positions.topicData.canEdit -->
                <div class="card-body">
                    <h5 class="position">{positionTypes.positions.description}</h5>
                    <h5 class="card-title">
                        <a href="/topic/{positionTypes.positions.topicData.tid}" target="_blank">
                            {positionTypes.positions.topicData.title}
                        </a>
                    </h5>
                    <h6 class="category-name">[[pindealbee:pagepreview-category]]: {positionTypes.positions.topicData.category.name}</h6>
                </div>
            </div>
            <!-- ENDIF positionTypes.positions.topicData -->

            <!-- IF !positionTypes.positions.topicData -->
            <div class="card empty">
                <span class="pull-right">
                    <a href="/pindealbee" class="fa fa-thumb-tack navigate-btn" target="_blank"></a>
                </span>
                <div class="card-body">
                    <h5 class="position">{positionTypes.positions.description}</h5>
                    <h5 class="card-title">[[pindealbee:pagepreview-empty]]</h5>
                    <h6 class="category-name">[[pindealbee:pagepreview-nocontent]]</h6>
                </div>
            </div>
            <!-- ENDIF !positionTypes.positions.topicData -->
        </div>
        <!-- END positionTypes.positions -->
    </div>
    <!-- END positionTypes -->
</div>