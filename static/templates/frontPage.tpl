<div widget-area="hp-header">
    <!-- BEGIN widgets.hp-header -->
    {{widgets.hp-header.html}}
    <!-- END widgets.hp-header -->
</div>
<div class="fluid-container" id="front-page-container">
    <div class="row">
        <div class="col-md-9">
            <div class="row" id="deals-container">
                <!-- BEGIN topics -->
                <div class="col-md-3 col-xs-4">
                    <div class="panel panel-default">
                        <div class="card">
                            <!-- IF topics.topic.discountPercentage -->
                            <div class="deal-discount-percentage">
                                -{{topics.topic.discountPercentage}}%
                            </div>
                            <!-- ENDIF topics.topic.discountPercentage -->
                            <div class="img-cover">
                                <img src="{{topics.topic.thumb}}" class="card-img-top" alt="No thumb">
                            </div>
                            <div class="card-body">
                                <h5 class="card-title"><a href="topic/{{topics.topic.slug}}">{{topics.topic.title}}</a>
                                </h5>
                                <div>
                                    <div class="deal-category">
                                        <a href="category/{{topics.category.slug}}" class="deal-category-name" style="color: {{topics.category.bgColor}}">
                                            <i class="fa {{topics.category.icon}}"></i>
                                            {{topics.categoryName}}
                                        </a>
                                    </div>
                                    <div class="deal-price-container">
                                        <div class="deal-price">
                                            {{topics.topic.price}} {{topics.topic.currency}}
                                        </div>
                                        <div class="deal-discount-price">
                                            {{topics.topic.discountPrice}} {{topics.topic.currency}}
                                        </div>
                                    </div>
                                    <div class="deal-stat">
                                    <span class="deal-comment">
                                        <i class="fa fa-comment pull-right"></i>
                                        <!-- IF topics.topic.postcount -->
                                        <span class="pull-right">{{topics.topic.postcount}}</span>
                                        <!-- ELSE -->
                                        <span class="pull-right">0</span>
                                        <!-- ENDIF topics.topic.postcount -->
                                    </span>
                                        <span class="deal-view">
                                        <i class="fa fa-eye pull-right"></i>
                                            <!-- IF topics.topic.viewcount -->
                                        <span class="pull-right">{{topics.topic.viewcount}}</span>
                                            <!-- ELSE -->
                                        <span class="pull-right">0</span>
                                            <!-- ENDIF topics.topic.viewcount -->
                                    </span>
                                        <span class="deal-vote">
                                        <i class="fa fa-thumbs-up pull-right"></i>
                                            <!-- IF topics.topic.upvotes -->
                                        <span class="pull-right">{{topics.topic.upvotes}}</span>
                                            <!-- ELSE -->
                                        <span class="pull-right">0</span>
                                            <!-- ENDIF topics.topic.upvotes -->
                                    </span>
                                    </div>
                                </div>
                                <div class="view-deal-btn">
                                    <a href="topic/{{topics.topic.slug}}" class="btn btn-default">[[pindealbee:front-page-viewdetail]]</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- END topics -->
            </div>
        </div>
        <div class="col-md-3">
            <div widget-area="hp-sidebar">
                <!-- IMPORT partials/categories-list.tpl -->
                <!-- BEGIN widgets.hp-sidebar -->
                {widgets.hp-sidebar.html}
                <!-- END widgets.hp-sidebar -->
            </div>
        </div>
    </div>
</div>
<div widget-area="hp-footer">
    <!-- BEGIN widgets.hp-footer -->
    {widgets.hp-footer.html}
    <!-- END widgets.hp-footer -->
</div>