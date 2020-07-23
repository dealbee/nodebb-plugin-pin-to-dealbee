<div>
    <h3 class="category-title">
        [[pindealbee:front-page-categories]]
    </h3>
    <!-- BEGIN categories -->
    <!-- IF !categories.disabled -->
    <div class="row category-row">
        <div class="col-xs-2">
            <span class="category-icon" style="background-color: {{categories.bgColor}}">
                <i class="fa {{categories.icon}}" style="color: {{categories.color}}"></i>
            </span>
        </div>
        <div class="col-xs-10">
            <span class="category-name">
                <a href="category/{{categories.slug}}" style="color: {{categories.bgColor}}">
                    {{categories.name}}
                </a>
            </span>
        </div>
    </div>
    <!-- ENDIF !categories.disabled -->
    <!-- END categories -->
</div>