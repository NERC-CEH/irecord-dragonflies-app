(function($){
    app.HOME = 'app/';

    //When leaving a page with a form
    window.onbeforeunload = function() {
        _log('Leaving.');
    };

    /*##############
     ## START APP ##
     ##############*/

    app.DEBUG = true;
    app.initialise();
    $.mobile.page.prototype.options.domCache = true;
    $.mobile.defaultDialogTransition = "none"; //old jQuery
    $.mobile.defaultPageTransition = "none";

    //Fixing back buttons
    $(document).on('pagecreate', function(event, ui) {
        if (browserDetect('Chrome')){
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