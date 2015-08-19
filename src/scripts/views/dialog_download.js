/******************************************************************************
 * Asks the user to start an appcache download process.
 *****************************************************************************/
define(['jquery'], function ($) {
    var Download = function (callback) {
        //for some unknown reason on timeout the popup does not disappear
        setTimeout(function () {
            function onSuccess() {
                app.models.user.set('downloaded-app', true);
                app.models.user.save();

                //Send update to Google Analytics
                if (app.CONF.GA.STATUS){
                    require(['ga'], function (ga) {
                        ga('send', 'event', 'app', 'downloadSuccess');
                    });
                }

                //finished reload popup
                var finishedBtnId = 'download-finished-restart-button';
                var finishedBtnCloseId = 'download-finished-close-button';

                var message =
                    '<center><h3>App can be used offline now</h3></center>' +
                    '<p>Do you want to restart it?</p>' +
                    '<button id="' + finishedBtnId + '">Restart Now</button>' +
                    '<button id="' + finishedBtnCloseId+ '">Restart Later</button>';

                app.message(message, 0);

                $('#' + finishedBtnId).on('click', function () {
                    window.location.reload();
                });
                $('#' + finishedBtnCloseId).on('click', function () {
                    $.mobile.loading('hide');
                    callback && callback(null);
                });
            }

            function onError(error) {
                _log(error, log.ERROR);
            }

            startManifestDownload('appcache', onSuccess, onError);
        }, 500);
    };

    /**
     * Starts an Appcache Manifest Downloading.
     *
     * @param id
     * @param files_no
     * @param src
     * @param callback
     * @param onError
     */
    function startManifestDownload (id, callback, onError) {
        /*todo: Add better offline handling:
         If there is a network connection, but it cannot reach any
         Internet, it will carry on loading the page, where it should stop it
         at that point.
         */
        if (navigator.onLine) {
            var src = app.CONF.OFFLINE.APPCACHE_URL;
            var frame = document.getElementById(id);
            if (frame) {
                //update
                frame.contentWindow.applicationCache.update();
            } else {
                //init
                app.message('<iframe id="' + id + '" src="' + src + '" width="215px" height="215px" scrolling="no" frameBorder="0"></iframe>', 0);
                frame = document.getElementById(id);

                //After frame loading set up its controllers/callbacks
                frame.onload = function () {
                    _log('Manifest frame loaded', log.INFO);
                    if (callback != null) {
                        frame.contentWindow.finished = callback;
                    }

                    if (onError != null) {
                        frame.contentWindow.error = onError;
                    }
                }
            }
        } else {
            app.message("<center><h2>Sorry</h2></center><br/><h3>Looks like you are offline!</h3>");
        }
    };

    return Download;
});