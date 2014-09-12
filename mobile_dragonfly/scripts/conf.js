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
    app.CONF.HOME = "";
    app.CONF.DEBUG = true;

    app.io.CONF.APPNAME = "";
    app.io.CONF.APPSECRET = "";

    //controllers
    var c = app.controller;
    c.list.CONF.PROB_DATA_SRC = "";
    c.list.CONF.SPECIES_DATA_SRC = "";

    c.login.CONF.URL = Drupal.settings.basePath + "user/mobile/register";
    c.login.CONF.APPNAME = app.io.CONF.APPNAME;
    c.login.CONF.APPSECRET = app.io.CONF.APPSECRET;