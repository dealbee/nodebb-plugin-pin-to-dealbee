<div class="container" id="pagePreview">
    <h1>[[pindealbee:pagepreview-title]]</h1>
    <!-- BEGIN areas -->
    <h2 class="position-type">{areas.name}</h2>
    <div class="row">
        <!-- BEGIN areas.positions -->
        <div class="col-md-3">
            <!-- IF areas.positions.topicData -->
            <div class="card">
                <!-- IF areas.positions.topicData.canEdit -->
                <span class="pull-right">
                    <i class="fa fa-trash unpin-btn" data-typeid={areas.id} data-posid={areas.positions.id} data-tid={areas.positions.topicData.tid}>
                    </i>
                </span>
                <!-- ENDIF areas.positions.topicData.canEdit -->
                <div class="card-body">
                    <h5 class="position">{areas.positions.description}</h5>
                    <h5 class="card-title">
                        <a href="/topic/{areas.positions.topicData.tid}" target="_blank">
                            {areas.positions.topicData.title}
                        </a>
                    </h5>
                    <h6 class="category-name">[[pindealbee:pagepreview-category]]: {areas.positions.topicData.category.name}</h6>
                </div>
            </div>
            <!-- ENDIF areas.positions.topicData -->

            <!-- IF !areas.positions.topicData -->
            <div class="card empty">
                <span class="pull-right">
                    <a href="/pindealbee" class="fa fa-thumb-tack navigate-btn" target="_blank"></a>
                </span>
                <div class="card-body">
                    <h5 class="position">{areas.positions.description}</h5>
                    <h5 class="card-title">[[pindealbee:pagepreview-empty]]</h5>
                    <h6 class="category-name">[[pindealbee:pagepreview-nocontent]]</h6>
                </div>
            </div>
            <!-- ENDIF !areas.positions.topicData -->
        </div>
        <!-- END areas.positions -->
    </div>
    <!-- END areas -->
</div>