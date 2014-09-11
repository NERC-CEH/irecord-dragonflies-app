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


var conf_app_home = "dragonfly/";

var conf_prob_data_src = "http://192.171.199.230/dragonfly/serv/abundance";
var conf_species_data_src = "http://192.171.199.230/dragonfly/serv/species";

var conf_login_url = Drupal.settings.basePath + "user/mobile/register";