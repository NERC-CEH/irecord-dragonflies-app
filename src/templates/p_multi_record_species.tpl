<div data-role="header" data-position="fixed" data-tap-toggle="false">
    <div class='ui-btn-left' data-role='controlgroup' data-type='horizontal'>
        <a href='#' data-rel='back' data-role="button" data-icon="arrow-l"
           data-iconpos="notext">Back</a>
    </div>
    <h3 id='multi_record_species_heading'>Edit Record</h3>
    <div class='ui-btn-right' data-role='controlgroup' data-type='horizontal'>
        <button id="multi-record-species-save" data-icon="plus" data-iconpos="right">Save</button>
    </div>
</div>
<div data-role="content">
    <div class="number-spin">
        <label for="AD">Adults</label>
        <input type="text" class="stages" data-mini="true" data-role="spinbox" name="AD" data-options='{"type":"horizontal"}' step="1" value="1" max="800" />
    </div>
    <div class="number-spin">
        <label for="CO">Copulating pair</label>
        <input type="text" class="stages" data-mini="true" data-role="spinbox" name="CO" data-options='{"type":"horizontal"}' step="1" value="0" max="800" />
    </div>
    <div class="number-spin">
        <label for="OV">Ovipositing</label>
        <input type="text" class="stages" data-mini="true" data-role="spinbox" name="OV" data-options='{"type":"horizontal"}' step="1" value="0" max="800" />
    </div>
    <div class="number-spin">
        <label for="LV">Larvae</label>
        <input type="text" class="stages" data-mini="true" data-role="spinbox" name="LV" data-options='{"type":"horizontal"}' step="1" value="0" max="800" />
    </div>
    <div class="number-spin">
        <label for="EX">Exuviae</label>
        <input type="text" class="stages" data-mini="true" data-role="spinbox" name="EX" data-options='{"type":"horizontal"}' step="1" value="0" max="800" />
    </div>
    <div class="number-spin">
        <label for="EM">Emergent</label>
        <input type="text" class="stages" data-mini="true" data-role="spinbox" name="EM" data-options='{"type":"horizontal"}' step="1" value="0" max="800" />
    </div>

    <a href="#comment" id="species-comment-button" class="record-button"
       data-role="button" data-icon="arrow-r" data-iconpos="right">
        <h3 class="heading">Comment</h3>
        <p class="descript"></p>
    </a>
</div>
