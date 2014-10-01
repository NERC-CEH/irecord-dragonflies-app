//APP LOGIC.

(function($){
    //When leaving a page with a form
    window.onbeforeunload = function() {
        _log('Leaving.');
    };

    app.initialise();
    $.mobile.page.prototype.options.domCache = true;
    $.mobile.defaultDialogTransition = "none"; //old jQuery
    $.mobile.defaultPageTransition = "none";

    //Fixing back buttons
    $(document).on('pagecreate', function(event, ui) {
        if (browserDetect('Safari')){
            var backButtonUrls = {
                'record'  :  'list',
                'species'  :  'list',
                'info'  :  'list',
                'settings'  :  'list',
                'helpers'  :  'list'
            };
            fixPageBackButtons(event.target.id, backButtonUrls);
        }
    });

}(app.$ || jQuery));