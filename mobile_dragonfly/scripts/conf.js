/**
 * App wide configuration file.
 *
 * Because a development/testing and production sites differ - URL paths,
 * environment etc. It is important to extract the hardcoded metadata and
 * put it into an external file.
 *
 * Idea: in the future this might become a JSON service output, so the configuration
 * could also be done on the website UI.
 */

    //app wide settings
    app.CONF.HOME = "dragonfly/";
    app.CONF.DEBUG = true;

    app.io.CONF.APPNAME = "dragonfly";
    app.io.CONF.APPSECRET = "mydragonfly";

    //controllers
    var c = app.controller;
    c.list.prob.CONF.PROB_DATA_SRC = "http://192.171.199.230/dragonfly/serv/abundance";
    c.list.CONF.SPECIES_DATA_SRC = "http://192.171.199.230/dragonfly/serv/species";

    c.login.CONF.URL = Drupal.settings.basePath + "user/mobile/register";
    c.login.CONF.APPNAME = app.io.CONF.APPNAME;
    c.login.CONF.APPSECRET = app.io.CONF.APPSECRET;