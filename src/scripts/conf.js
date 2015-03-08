/*!
 * CONFIGURATION.
 */
define(['morel'], function () {
  app = window.app || {};

//app wide settings
  app.CONF = {
    VERSION: '0', //version grunt replaced //Application (controllers and data) version
    NAME: 'app', //name grunt replaced
    HOME: "raf/dist/",
    LOG: morel.LOG_DEBUG,
    SPECIES_DATA_SRC: "data/species.json",
    PROB_DATA_SRC: "data/abundance.json",
    APPCACHE_SRC: "appcache.html",
    LOGIN_URL: "http://192.171.199.230/iRecord/user/mobile/register",
    LOGIN_TIMEOUT: 20000,
    //app feature settings
    FEATURES: {
      LOGIN: 'simulate',
      SEND_RECORD: 'simulate',
      REGISTER: true
    }
  };

//morel configuration
  morel.CONF.NAME = app.CONF.NAME;
  morel.io.CONF.RECORD_URL = 'http://192.171.199.230/iRecord/mobile/submit';
  morel.auth.CONF = {
    APPNAME: "testApp",
    APPSECRET: "testAppSecret",
    WEBSITE_ID: 23,
    SURVEY_ID: 42
  };
  morel.geoloc.CONF.GPS_ACCURACY_LIMIT = 100; //meters
  $.extend(morel.record.inputs.KEYS, {
    NUMBER: 'sample:number',
    STAGE: 'sample:stage',
    LOCATIONDETAILS: 'sample:locationdetails'
  });
});