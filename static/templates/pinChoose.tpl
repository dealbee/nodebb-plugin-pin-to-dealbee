<div id="pinChoose" class="modal container">
    <!-- Modal content -->
    <div class="modal-content">
        <div class="modal-header">
            <span class="close">&times;</span>
            <h2>
                [[pindealbee:pinchoose-title]]
            </h2>
        </div>
        <div class="modal-body">
            <form>
                <div class="row">
                    <!-- BEGIN areas -->
                    <div class="container">
                        <label class="radio-inline">
                            <input type="radio" name="pinChoose" data-type={areas.id} data-position="empty">
                            <span class="areaName">{areas.name}</span>
                        </label>
                    </div>
                    <!-- END areas -->
                </div>
            </form>
        </div>
        <div class="row modal-footer" style="display:flex; justify-content: center; margin-top:20px;">
            <h4>
                <button class="btn btn-success" id="submitPin">[[pindealbee:pinchoose-submit]]</button>
            </h4>
        </div>
    </div>
</div>