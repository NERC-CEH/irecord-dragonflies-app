/*!
 * CONFIGURATION.
 */
define(['morel'], function () {
  app = window.app || {};
  app.CONF = {};

//app wide settings
  app.CONF.SPECIES_DATA_SRC = "data/species.json";
  app.CONF.PROB_DATA_SRC = "data/abundance.json";
  app.CONF.APPCACHE_SRC = "appcache.html";
  app.CONF.LOGIN_URL = "http://192.171.199.230/iRecord/user/mobile/register";
  app.CONF.LOGIN_TIMEOUT = 20000;


//morel configuration
  app.CONF.VERSION = '0'; //grunt replaced. Application (controllers and data) version
  app.CONF.NAME = 'app'; //grunt replaced.

  app.CONF.HOME = "raf/dist/";
  app.CONF.LOG = morel.LOG_DEBUG;

  morel.CONF.NAME = app.CONF.NAME;
  morel.io.CONF.RECORD_URL = 'http://192.171.199.230/iRecord/mobile/submit';
  morel.auth.CONF = {
    APPNAME: "testApp",
    APPSECRET: "testAppSecret",
    WEBSITE_ID: 23,
    SURVEY_ID: 42
  };
  morel.geoloc.CONF.GPS_ACCURACY_LIMIT = 100; //meters
  morel.record.inputs.KEYS.NUMBER = 'sample:number';
  morel.record.inputs.KEYS.STAGE = 'sample:stage';
  morel.record.inputs.KEYS.LOCATIONDETAILS = 'sample:locationdetails';
});