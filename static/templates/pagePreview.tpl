<div class="container" id="pagePreview">
    <!-- BEGIN positionTypes -->
    <h2>{positionTypes.positionName}</h2>
    <div class="row">
        <!-- BEGIN positionTypes.positions -->
        <div class="col-md-3">
            <!-- IF positionTypes.positions.topicData -->
            <div class="card">
                <!-- IF positionTypes.positions.topicData.canEdit -->
                <span class="pull-right">
                    <button class="fa fa-trash btn btn-danger"></button>
                </span>
                <!-- ENDIF positionTypes.positions.topicData.canEdit -->
                <div class="card-body">
                    <h4 class="position">{positionTypes.positions.description}</h4>
                    <h5 class="card-title">{positionTypes.positions.topicData.title}</h5>
                    <h6 class="category-name">Category: {positionTypes.positions.topicData.category.name}</h6>
                </div>
            </div>
            <!-- ENDIF positionTypes.positions.topicData -->

            <!-- IF !positionTypes.positions.topicData -->
            <div class="card empty">
                <span class="pull-right">
                    <button class="fa fa-thumb-tack btn btn-success"></button>
                </span>
                <div class="card-body">
                    <h4 class="position">{positionTypes.positions.description}</h4>
                    <h5 class="card-title">Empty</h5>
                    <h6 class="category-name">No content to display</h6>
                </div>
            </div>
            <!-- ENDIF !positionTypes.positions.topicData -->
        </div>
        <!-- END positionTypes.positions -->
    </div>
    <!-- END positionTypes -->
</div>