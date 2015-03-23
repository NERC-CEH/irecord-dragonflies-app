/**
 * Takes care of application execution logging.
 *
 * Depends on morel.
 *
 * Uses 5 levels of logging:
 *  0: none
 *  1: errors
 *  2: warnings
 *  3: information
 *  4: debug
 *
 * Levels values defined in core app module.
 *
 * @param message
 * @param level
 * @private
 */

window.log = {
  NONE: 0,
  ERROR: 1,
  WARNING: 2,
  INFO: 3,
  DEBUG: 4,

  CONF: {
    STATUS: 4,
    ERROR_URL: '',
    APP_NAME: '',
    APP_VERSION: ''
  },

  core: function (message, level) {
    "use strict";
    //do nothing if logging turned off
    if (log.CONF.STATE === log.NONE) {
      return;
    }

    if (log.CONF.STATE >= level || !level) {
      switch (level) {
        case log.ERROR:
          log.error(log.CONF.ERROR_URL, message);
          break;
        case log.WARNING:
          console.warn(message);
          break;
        case log.INFO:
          console.log(message);
          break;
        case log.DEBUG:
        /* falls through */
        default:
          //IE does not support console.debug
          if (!console.debug) {
            console.log(message);
            break;
          }
          console.debug(message);
      }
    }
  },


  /**
   * Prints and posts an error to the mobile authentication log.
   *
   * @param error object holding a 'message', and optionally 'url' and 'line' fields.
   * @private
   */
  error: function (errorLogURL, error) {
    "use strict";
    //print error
    console.error(error.message, error.url, error.line);

    //prepare the message
    var message = '<b style="color: red">' + error.message + '</b>';
    message += '</br><b> morel version = </b><i>"' + morel.VERSION + '"</i>';

    message += '</br><b> app name = </b><i>"' + log.CONF.APP_NAME + '"</i>';
    message += '</br><b> app version = </b><i>"' + log.CONF.APP_VERSION + '"</i></br>';

    //browser info
    message += '</br>' + navigator.appName;
    message += '</br>' + navigator.appVersion;

    var url = error.url + ' (' + error.line + ')';

    if (navigator.onLine) {
      //send to server

      var data = {};
      data.append = function (name, value) {
        this[name] = value;
      };
      data.append('message', message);
      data.append('url', url);
      morel.auth.appendApp(data);

      //removing unnecessary information
      delete data.append;

      jQuery.ajax({
        url: errorLogURL,
        type: 'post',
        dataType: 'json',
        success: function (data) {
          console.log(data);
        },
        data: data
      });
    }
  },

  /**
   * Hook into window.error function.
   *
   * @param message
   * @param url
   * @param line
   * @returns {boolean}
   * @private
   */
  onError: function (message, url, line) {
    "use strict";
    window.onerror = null;

    var error = {
      'message': message,
      'url': url || '',
      'line': line || -1
    };

    _log(error, log.ERROR);

    window.onerror = this; // turn on error handling again
    return true; // suppress normal error reporting
  }

};

window._log = log.core;

var app = app || {};

/**
 * Displays a self disappearing lightweight message.
 *
 * @param text
 * @param time 0 if no hiding, null gives default 3000ms delay
 */
app.message = function (text, time) {
  if (!text) {
    _log('NAVIGATION: no text provided to message.', log.ERROR);
    return;
  }

  var messageId = 'morelLoaderMessage';

  text = '<div id="' + messageId + '">' + text + '</div>';

  $.mobile.loading('show', {
    theme: "b",
    textVisible: true,
    textonly: true,
    html: text
  });

  //trigger JQM beauty
  $('#' + messageId).trigger('create');

  if (time !== 0) {
    setTimeout(function () {
      $.mobile.loading('hide');
    }, time || 3000);
  }
};

/**
 * Asks the user to start an appcache download
 * process.
 */
app.download = function () {
  var downloadedApp = app.models.user.get('downloadedApp');
  var dontAskDownloadApp = app.models.user.get('dontAskDownloadApp');

  if (!downloadedApp && !dontAskDownloadApp) {
    var donwloadBtnId = "download-button";
    var donwloadCancelBtnId = "download-cancel-button";
    var downloadCheckbox = "download-checkbox";

    var message =
      '<h3>Start downloading the app for offline use?</h3></br>' +

      '<label><input id="' + downloadCheckbox + '" type="checkbox" name="checkbox-0 ">Don\'t ask again' +
      '</label> </br>' +

      '<button id="' + donwloadBtnId + '" class="ui-btn">Download</button>' +
      '<button id="' + donwloadCancelBtnId + '" class="ui-btn">Cancel</button>';

    app.message(message, 0);

    $('#' + donwloadBtnId).on('click', function () {
      _log('helpers: starting appcache downloading process.', log.DEBUG);
      $.mobile.loading('hide');

      //for some unknown reason on timeout the popup does not disappear
      setTimeout(function () {
        function onSuccess() {
          app.models.user.save('downloadedApp', true);

          //finished reload popup
          var finishedBtnId = 'download-finished-restart-button';
          var finishedBtnCloseId = 'download-finished-close-button';

          var message =
            '<h3>App can be used offline now.</h3>' +
            '<p>Do you want to restart it?</p>' +
            '<button id="' + finishedBtnId + '">Restart Now</button>' +
            '<button id="' + finishedBtnCloseId+ '">Restart Later</button>';

          app.message(message, 0);

          $('#' + finishedBtnId).on('click', function () {
            window.location.reload();
          });
          $('#' + finishedBtnCloseId).on('click', function () {
            $.mobile.loading('hide');
          });
        }

        function onError() {
          _log('helpers: ERROR appcache.');
        }

        app.startManifestDownload('appcache', onSuccess, onError);
      }, 500);
    });

    $('#' + donwloadCancelBtnId).on('click', function () {
      _log('helpers: appcache dowload canceled.', log.DEBUG);
      $.mobile.loading('hide');

      var dontAsk = $('#' + downloadCheckbox).prop('checked');
      app.models.user.save('downloadedApp', false);
      app.models.user.save('dontAskDownloadApp', dontAsk);
    });
  }
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
app.startManifestDownload = function (id, callback, onError) {
  /*todo: Add better offline handling:
   If there is a network connection, but it cannot reach any
   Internet, it will carry on loading the page, where it should stop it
   at that point.
   */
  if (navigator.onLine) {
    var src = app.CONF.APPCACHE_URL;
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
    app.message("Looks like you are offline!");
  }
};

/**
 * Since the back button does not work in current iOS 7.1.1 while in app mode,
 * it is necessary to manually assign the back button urls.
 *
 * Set up the URL replacements so that the id of the page is matched with the
 * new URL of the back buttons it contains. The use of wild cards is possible:

 backButtonUrls = {
  'app-*':'home',
  'app-examples':'home',
  'tab-location':'home'
};
 */

/**
 * Generic function to detect the browser
 *
 * Chrome has to have and ID of both Chrome and Safari therefore
 * Safari has to have an ID of only Safari and not Chrome
 */
app.browserDetect = function (browser) {
  "use strict";
  if (browser === 'Chrome' || browser === 'Safari') {
    var isChrome = navigator.userAgent.indexOf('Chrome') > -1,
      isSafari = navigator.userAgent.indexOf("Safari") > -1,
      isMobile = navigator.userAgent.indexOf("Mobile") > -1;

    if (isSafari) {
      if (browser === 'Chrome') {
        //Chrome
        return isChrome;
      }
      //Safari
      return !isChrome;
    }
    if (isMobile) {
      //Safari homescreen Agent has only 'Mobile'
      return true;
    }
    return false;
  }
  return (navigator.userAgent.indexOf(browser) > -1);
};

app.fixIOSbuttons = function () {
  //Fixing back buttons for Mac 7.* History bug.
  $(document).on('pagecreate', function (event, ui) {
    if (app.browserDetect('Safari')) {
      if (jQuery.mobile.activePage) {
        var nextPageid = event.target.id;
        var currentPageURL = null;

        var external = jQuery.mobile.activePage.attr('data-external-page');
        if (!external) {
          currentPageURL = '#' + jQuery.mobile.activePage.attr('id');
        }
        fixPageBackButtons(currentPageURL, nextPageid);
      }
    }
  });

  /**
   * Fixes back buttons for specific page
   */
  /*jslint unparam: true*/
  function fixPageBackButtons(currentPageURL, nextPageId) {
    "use strict";
    console.log('FIXING: back buttons ( ' + nextPageId + ')');

    var $buttons = jQuery("div[id='" + nextPageId + "'] a[data-rel='back']");
    $buttons.each(function (index, button) {
      jQuery(button).removeAttr('data-rel');

      //skip external pages
      if (currentPageURL) {
        //assign new url to the button
        jQuery(button).attr('href', currentPageURL);
      }
    });
  }

  /*jslint unparam: false*/
};

/**
 * Updates the app's data if the source code version mismatches the
 * stored data's version.
 */
app.checkForUpdates = function () {
  var appVer = app.models.app.get('appVer');
  if (appVer !== app.VERSION) {
    _log('helpers: app version differs. Updating.', log.INFO);

    //set new version
    app.models.app.save('appVer', app.VERSION);
  }
};