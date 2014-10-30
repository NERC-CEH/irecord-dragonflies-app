//CONFIGURATION.
app.controller.version = '0'; //application controllers version


//Because a development/testing and production sites differ - URL paths,
//environment etc. It is important to extract the hardcoded metadata and
//put it into an external file.

//Idea: in the future this might become a JSON service output, so the configuration
//could also be done on the website UI.


//app wide settings
app.CONF.HOME = "dragonfly/";
app.CONF.LOG = app.LOG_DEBUG;

app.auth.CONF.APPNAME = "dragonfly";
app.auth.CONF.APPSECRET = "mydragonfly";
app.auth.CONF.WEBSITE_ID = 77;
app.auth.CONF.SURVEY_ID = 135;

app.geoloc.CONF.GPS_ACCURACY_LIMIT = 10; //meters

app.io.CONF.RECORD_URL = "mobile/submit";

//controllers
var c = app.controller;
c.list.prob.CONF.PROB_DATA_SRC = "http://192.171.199.230/dragonfly/serv/abundance";
c.list.CONF.SPECIES_DATA_SRC = "http://192.171.199.230/dragonfly/serv/species";

c.login.CONF.URL = Drupal.settings.basePath + "user/mobile/register";
c.register.CONF.URL = c.login.CONF.URL;

window.onerror = _onerror;
