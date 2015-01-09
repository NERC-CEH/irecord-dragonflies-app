//APP LOGIC.
(function($){
    //When leaving a page with a form
    window.onbeforeunload = function() {
        _log('Leaving.');
    };

    checkForUpdates();
    app.initialise();

    //Fixing back buttons for Mac 7.* History bug.
    $(document).on('pagecreate', function(event, ui) {
        if (browserDetect('Safari')){
            if (jQuery.mobile.activePage != null) {
                var nextPageid = event.target.id;
                var currentPageURL = null;

                var external = jQuery.mobile.activePage.attr('data-external-page');
                if (external == null) {
                    currentPageURL = '#' + jQuery.mobile.activePage.attr('id');
                }

                fixPageBackButtons(currentPageURL, nextPageid);
            }
        }
    });

}(app.$ || jQuery));

/**
 * Updates the app's data if the source code version mismatches the
 * stored data's version.
 */
function checkForUpdates(){
    var CONTROLLER_VERSION_KEY = 'controllerVersion';
    var controllerVersion = app.settings(CONTROLLER_VERSION_KEY);
    //set for the first time
    if (controllerVersion == null){
        app.settings(CONTROLLER_VERSION_KEY, app.CONF.VERSION);
        return;
    }

    if (controllerVersion != app.CONF.VERSION){
        _log('app: controller version differs. Updating the app.', app.LOG_INFO);

        app.storage.remove('species');
        app.storage.remove('probability');
        app.storage.remove('flight');

        app.storage.tmpClear();
        app.settings(CONTROLLER_VERSION_KEY, app.CONF.VERSION);
    }
}