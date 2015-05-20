/******************************************************************************
 * Main app configuration file.
 *****************************************************************************/
define(['morel', 'helpers/log'], function () {
  app = window.app || {};

  app.VERSION = '0'; //version grunt replaced
  app.NAME = 'app'; //name grunt replaced

  app.CONF = {
    //app feature settings
    OFFLINE: {
      STATUS: true,
      APPCACHE_URL: "appcache.html"
    },
    GA: {
      //Google Analytics settings
      STATUS: true,
      ID: 'UA-58378803-2'
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
    },
    LIST: {
      DEFAULT_SORT: 'taxonomic'
    }
  };

  //logging
  log.CONF = {
    STATE: log.INFO,
    GA_ERROR: true //log error using google analytics
  };

  //morel configuration
  morel.CONF.NAME = app.NAME;
  morel.io.CONF.RECORD_URL = app.CONF.SEND_RECORD.URL;
  morel.geoloc.CONF.GPS_ACCURACY_LIMIT = 100; //meters
  $.extend(morel.auth.CONF, {
    APPNAME: "test",
    APPSECRET: "mytest",
    WEBSITE_ID: 23,
    SURVEY_ID: 256
  });
  $.extend(morel.record.inputs.KEYS, {
    NUMBER: 'occAttr:379',
    NUMBER_VAL: {
      '1': 665,
      '2-5': 666,
      '6-20': 667,
      '21-100': 668,
      '101-500': 669,
      '500+': 670,
      'Present': 671 //default
    },
    STAGE: 'occAttr:378',
    STAGE_VAL: {
      Adult: 4756,
      Copulating: 4757,
      Ovipositing: 4758,
      Larva: 4759,
      Exuvia: 4760,
      Emergent: 4761
    },
    SREF_NAME: 'smpAttr:566',
    CERTAIN: 'occAttr:32',
    CERTAIN_VAL: {
      TRUE: 663,
      FALSE: 664 //default
    },
    COMMENT: 'sample:comment'
  });
});