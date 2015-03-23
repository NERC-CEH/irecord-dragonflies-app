/*!
 * CONFIGURATION.
 */
define(['morel'], function () {
  app = window.app || {};
  //app wide settings
  app.VERSION = '0'; //version grunt replaced
  app.NAME = 'app'; //name grunt replaced

  app.CONF = {
    //app feature settings
    OFFLINE: {
      APPCACHE_URL: "appcache.html"
    },
    LOGIN: {
      STATUS: true,
      URL: "http://192.171.199.230/irecord7/user/mobile/register",
      TIMEOUT: 80000
    },
    SEND_RECORD: {
      STATUS: true,
      URL: "http://192.171.199.230/irecord7/mobile/submit"
    },
    REGISTER: {
      STATUS: true
    }
  };

  //logging
  log.CONF = {
    STATE: log.DEBUG,
    ERROR_URL: "http://192.171.199.230/irecord7/mobile/log",
    APP_NAME: app.NAME,
    APP_VERSION: app.VERSION
  };

  //morel configuration
  morel.CONF.NAME = app.NAME;
  morel.io.CONF.RECORD_URL = app.CONF.SEND_RECORD.URL;
  morel.geoloc.CONF.GPS_ACCURACY_LIMIT = 100; //meters
  $.extend(morel.auth.CONF, {
    APPNAME: "test",
    APPSECRET: "mytest",
    WEBSITE_ID: 23,
    SURVEY_ID: 18
  });
  $.extend(morel.record.inputs.KEYS, {
    NUMBER: 'sample:number',
    STAGE: 'sample:stage',
    LOCATIONDETAILS: 'sample:locationdetails',
    SREF_NAME: 'smpAttr:location',
    CERTAIN: 'sample:checked'
  });
});