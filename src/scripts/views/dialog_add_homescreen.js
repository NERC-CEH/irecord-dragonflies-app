/******************************************************************************
 * Asks the user to start an appcache download process.
 *****************************************************************************/
define(['jquery', 'helpers/browser'], function ($, browser) {
    var Dialog = function (callback) {
        if(browser.isMobile() && !browser.isHomeMode()) {
            setTimeout(function(){
                var addingToHomeScreen = '<p>1. Open <strong>Browser Options</strong></p>' +
                    '<p>2. Tap <strong>Add to Home Screen</strong></p>';

                if(browser.isIOS()){
                    addingToHomeScreen =

                        '<ol>' +
                        '<li class="instruction">' +
                            '<img id="safari-add-homescreen" src="images/add_homescreen_1.png">' +
                            '<p>Click <b>Sharing button</b></p>' +
                        '</li>' +
                        '<li class="instruction">' +
                            '<img id="safari-add-homescreen" src="images/add_homescreen_2.png">' +
                            '<p>Tap <b>Add to home screen</b></p>' +
                        '</li>' +
                        '</ol>';
                }

                var message =
                    '<div class="add-homescreen">' +
                    '<center><h2>Save app to Homescreen</h2></center>' +
                    addingToHomeScreen + '</div>';

                app.message(message, 0, callback);
            }, 500);
        }
    };

    return Dialog;
});