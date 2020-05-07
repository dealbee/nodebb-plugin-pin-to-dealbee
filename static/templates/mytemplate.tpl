<div id="pinDealBeeModal" class="modal container">
  <!-- Modal content -->
  <div class="modal-content">
    <div class="modal-content-header">
      <span class="close">&times;</span>
      <h2>Choose position</h2>
    </div>
    <div class="modal-content-body">
      <div>
        <!-- BEGIN positionTypes -->
        <div>
          <h3>
            {positionTypes.positionName}
          </h3>
          <!-- BEGIN positionTypes.positions -->
          <div class="check-line row" data-type={positionTypes.id} data-position={positionTypes.positions.id}>
            <div class="col-md-1 checkmark">
              <i class="fa fa-check-square"></i>
            </div>
            <div class="col-md-11">
              {positionTypes.positions.description}
            </div>
          </div>
          <div class="divider"></div>
          <!-- END positionTypes.positions -->
        </div>
        <!-- END positionTypes -->
      </div>
    </div>
    <button class="btn btn-success" id="submitPin">Submit</button>
  </div>
</div>