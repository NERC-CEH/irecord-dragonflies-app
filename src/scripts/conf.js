/*!
 * CONFIGURATION.
 */
define(['morel'], function () {
  app = window.app || {};

//app wide settings
  app.CONF = {
    VERSION: '0', //version grunt replaced //Application (controllers and data) version
    NAME: 'app', //name grunt replaced
    LOG: morel.LOG_DEBUG,
    APPCACHE_SRC: "appcache.html",
    LOGIN_URL: "http://192.171.199.230/irecord7/user/mobile/register",
    LOGIN_TIMEOUT: 20000,
    //app feature settings
    FEATURES: {
      LOGIN: true,
      SEND_RECORD: true,
      REGISTER: true
    }
  };

//morel configuration
  morel.CONF.NAME = app.CONF.NAME;
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
    LOCATIONDETAILS: 'sample:locationdetails'
  });
});