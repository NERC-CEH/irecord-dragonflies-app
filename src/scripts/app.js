/*!
 * App wide logic.
 */

define(['backbone', 'morel'], function (Backbone, morel){
  var init = function () {
    //overwrite morel user append function to match backbone
    morel.auth.getUser = function () {
      return app.models.user.attributes;
    };

    app.checkForUpdates();

    app.router = new app.Router();
    Backbone.history.start();

    app.fixIOSbuttons();

    FastClick.attach(document.body);
  };

  return init;
});
