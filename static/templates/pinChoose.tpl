<div id="pinChoose" class="modal container">
    <!-- Modal content -->
    <div class="modal-content">
        <div class="modal-content-header">
            <span class="close">&times;</span>
            <h2>Choose position</h2>
        </div>
        <div class="modal-content-body">
            <form>
                <div class="row">
                    <!-- BEGIN positionTypes -->
                    <h4 class="container">
                        {positionTypes.positionName}
                    </h4>
                    <div class="container">
                        <!-- BEGIN positionTypes.positions -->
                        <label class="radio-inline">
                            <input type="radio" name="pinChoose" data-type={positionTypes.id} data-position={positionTypes.positions.id}>
                            <span class="badge badge-primary">{positionTypes.positions.description}</span>
                        </label>
                        <!-- END positionTypes.positions -->
                    </div>
                    <!-- END positionTypes -->
                </div>
            </form>

            <div class="row" style="display:flex; justify-content: center; margin-top:20px;">
                <h4>
                    <button class="btn btn-success" id="submitPin">Submit</button>
                </h4>
            </div>
        </div>
    </div>
</div>