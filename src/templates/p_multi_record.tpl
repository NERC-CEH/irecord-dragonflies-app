<div data-role="header" data-position="fixed" data-tap-toggle="false">
    <div class='ui-btn-left' data-role='controlgroup' data-type='horizontal'>
        <a href='#' data-rel='back' data-role="button" data-icon="arrow-l"
           data-iconpos="notext">Back</a>
    </div>
    <h3 id='multi_record_heading'>Species</h3>
    <div class='ui-btn-right' data-role='controlgroup' data-type='horizontal'>
        <button id="multi-save" data-icon="plus" data-iconpos="right"
                data-theme="b">Save</button>
    </div>
</div>
<div data-role="content">
    <div id="empty-list-message" class="info-message">
        <p>No species has been selected to the list. Please add some
            using the plus button below.</p>
    </div>
    <a href="#list/record" id="multi-record-add-button" data-iconpos="notext"
       data-role="button" data-icon="plus">Add species</a>
    <br/>
    <div id="recorded-species-list"></div>
</div>

