/*!
 * CONFIGURATION.
 */
define(['morel'], function () {
  app = window.app || {};
  //app wide settings

  app.VERSION = '0'; //version grunt replaced
  app.NAME = 'app'; //name grunt replaced

  app.CONF = {
    APPCACHE_URL: "appcache.html",
    LOGIN_URL: "http://192.171.199.230/irecord7/user/mobile/register",
    LOGIN_TIMEOUT: 80000,
    //app feature settings
    FEATURES: {
      LOGIN: true,
      SEND_RECORD: true,
      REGISTER: true
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
  morel.io.CONF.RECORD_URL = 'http://192.171.199.230/irecord7/mobile/submit';
  morel.auth.CONF = {
    APPNAME: "test",
    APPSECRET: "mytest",
    WEBSITE_ID: 23,
    SURVEY_ID: 18
  };
  morel.geoloc.CONF.GPS_ACCURACY_LIMIT = 100; //meters
  $.extend(morel.record.inputs.KEYS, {
    NUMBER: 'sample:number',
    STAGE: 'sample:stage',
    LOCATIONDETAILS: 'sample:locationdetails',
    CERTAIN: 'sample:checked'
  });
});