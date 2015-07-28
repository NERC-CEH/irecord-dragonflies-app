<div data-role="header" data-position="fixed" data-tap-toggle="false">
    <div class='ui-btn-left' data-role='controlgroup' data-type='horizontal'>
        <a href='#' data-rel='back' data-role="button" data-icon="arrow-l"
           data-iconpos="notext">Back</a>
    </div>
    <h3 id='record_heading'>Record</h3>
    <div class='ui-btn-right' data-role='controlgroup' data-type='horizontal'>
        <input id="entry-form-save" type="button" value="Save" data-icon="plus"
               data-theme="b" data-iconpos="right">
    </div>
</div>
<div data-role="content">
    <div class="core-inputs">
        <h3 id='record_species'></h3>
        <div id="photo"></div>
        <div id="photo-picker">
            <input type="file" id="sample:image" name="sample:image"
                   accept="png|jpg|gif|jpeg"/>
        </div>
        <ul data-role="listview" class="core-inputs" data-inset="true">
            <li>
                <a href="#location" id="location-button" class="record-button"
                   data-role="button" data-icon="location" data-iconpos="right">
                    <h3 class="heading">Location</h3>
                    <p class="descript"></p>
                </a>
            </li>
            <li>
                <a href="#date" id="date-button" class="record-button"
                   data-role="button" data-icon="calendar" data-iconpos="right">
                    <h3 class="heading">Date</h3>
                    <p class="descript"></p>
                </a>
            </li>
        </ul>
    </div>
    <ul data-role="listview" data-inset="true">
        <li>
            <a href="#number" id="number-button" class="record-button"
               data-role="button" data-icon="arrow-r" data-iconpos="right">
                <h3 class="heading">Number</h3>
                <p class="descript"></p>
            </a>
        </li>
        <li>
            <a href="#stage" id="stage-button" class="record-button" data-role="button"
               data-icon="arrow-r" data-iconpos="right">
                <h3 class="heading">Life Stage</h3>
                <p class="descript"></p>
            </a>
        </li>
        <li>
            <a href="#comment" id="comment-button" class="record-button"
               data-role="button"
               data-icon="arrow-r" data-iconpos="right">
                <h3 class="heading">Comment</h3>
                <p class="descript"></p>
            </a>
        </li>
    </ul>
    <label id="certain-button-label">
        <input name="certain" id="certain-button" type="checkbox"
               data-iconpos="right" checked> Certain
    </label>
</div>
