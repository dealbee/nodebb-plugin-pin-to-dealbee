<div id="pinChoose" class="modal container">
    <!-- Modal content -->
    <div class="modal-content">
        <div class="modal-content-header">
            <span class="close">&times;</span>
            <h2>
                [[pindealbee:pinchoose-title]]
            </h2>
        </div>
        <div class="modal-content-body">
            <form>
                <div class="row">
                    <!-- BEGIN areas -->
                    <h4 class="container">
                        {areas.name}
                    </h4>
                    <div class="container">
                        <!-- BEGIN areas.positions -->
                        <label class="radio-inline">
                            <input type="radio" name="pinChoose" data-type={areas.id} data-position={areas.positions.id}>
                            <span class="badge badge-primary">{areas.positions.description}</span>
                        </label>
                        <!-- END areas.positions -->
                    </div>
                    <!-- END areas -->
                </div>
            </form>

            <div class="row" style="display:flex; justify-content: center; margin-top:20px;">
                <h4>
                    <button class="btn btn-success" id="submitPin">[[pindealbee:pinchoose-submit]]</button>
                </h4>
            </div>
        </div>
    </div>
</div>