/******************************************************************************
 * Updates the app's data if the source code version mismatches the stored
 * data's version.
 *****************************************************************************/
define([], function () {
    var CheckForUpdates = function () {
        var appVer = app.models.app.get('appVer');
        if (appVer !== app.VERSION) {
            _log('helpers: app version differs. Updating.', log.INFO);

            switch (appVer) {
                case '1.0.0':
                case '1.0.1':
                case '1.0.2':
                    var location = app.models.user.get('location');
                    if (location){
                        var loc = location.split(',');
                        if (loc.length) {
                            app.models.user.setLocation({
                                latitude: loc[0],
                                longitude: loc[1],
                                accurracy: 1,
                                name: ''
                            })
                        }
                    }

                    break;
                default:

            }
            //set new version
            app.models.app.save('appVer', app.VERSION);

            if (app.CONF.GA.STATUS) {
                require(['ga'], function(ga) {
                    ga('send', 'event', 'app', 'updateSuccess');
                });
            }
        }
    };

    return CheckForUpdates;
});
