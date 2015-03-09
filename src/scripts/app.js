define([
    'jquery',
    'jquery.mobile',
    'backbone',
    'fastclick',
    'klass',
    'routers/router',
    'models/app',
    'models/user',
    'models/species',
    'models/record',
    'helpers',
    'data'
  ],
  function ($, jqm, Backbone, FastClick, klass, Router, AppModel, UserModel,
            SpeciesCollection, RecordModel) {
    var App = {
      init: function () {
        //overwrite morel user append function to match backbone
        window.morel.auth.getUser = function () {
          return app.models.user.attributes;
        };

        //init data
        app.models = {};
        app.models.user = new UserModel();
        app.models.app = new AppModel();
        app.models.record = new RecordModel();
        app.collections = {};
        app.collections.species = new SpeciesCollection(app.data.species);

        app.checkForUpdates();

        app.router = new Router();
        Backbone.history.start();

        app.fixIOSbuttons();
        FastClick.attach(document.body);

        $('.loading').css('display', 'none');
      }
    };
    return App;
  });