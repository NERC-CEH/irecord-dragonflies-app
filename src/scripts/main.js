(function () {
  require.config({
    baseUrl: "scripts/",
    paths: {
      'jquery': 'libs/jquery',
      'jquerymobile': 'libs/jquery.mobile-1.4.5',
      'IndexedDBShim': 'libs/IndexedDBShim',
      'vector3d': 'libs/vector3d',
      'geo': 'libs/geo',
      'latlon-ellipsoid': 'libs/latlon-ellipsoid',
      'osgridref': 'libs/osgridref',
      'klass': 'libs/klass.min',
      'photoswipe': 'libs/code.photoswipe.jquery-3.0.5.min',
      'fastclick': 'libs/fastclick',
      'd3': 'libs/d3',
      'morel': 'libs/morel',
      'underscore': 'libs/lodash',
      'backbone': 'libs/backbone',
      'backbone.localStorage': 'libs/backbone.localStorage'
    },
    shim: {
      'backbone': {depts: ['jquery', 'underscore'], "exports": "Backbone"},
      'morel': {depts: ['IndexedDBShim']},
      'photoswipe': {depts: ['jquery', 'klass'], exports : 'Code.PhotoSwipe'}
    },
    waitSeconds: 20
  });

  require(['jquery', 'klass'], function($) {

    $( document ).one( "mobileinit", function() {
      //JQM configuration
      jQuery.mobile.ns = "";
      jQuery.mobile.autoInitializePage = true;
      jQuery.mobile.subPageUrlKey = "ui-page";
      jQuery.mobile.activePageClass = "ui-page-active";
      jQuery.mobile.activeBtnClass = "ui-btn-active";
      jQuery.mobile.defaultPageTransition = "";
      jQuery.defaultDialogTransition = "";
      jQuery.mobile.minScrollBack = "150";
      jQuery.mobile.loadingMessage = "Loading";
      jQuery.mobile.pageLoadErrorMessage = "Error Loading Page";
      jQuery.mobile.touchOverflowEnabled = 0;

      //Disable jQM routing and component creation events
      //disable hash-routing
      jQuery.mobile.hashListeningEnabled = false;
      //disable anchor-control
      jQuery.mobile.linkBindingEnabled = false;
      //can cause calling object creation twice and back button issues are solved
      jQuery.mobile.ajaxEnabled = false;
      //Otherwise after mobileinit, it tries to load a landing page
      jQuery.mobile.autoInitializePage = false;
      //we want to handle caching and cleaning the DOM ourselves
      jQuery.mobile.page.prototype.options.domCache = false;

      //consider due to compatibility issues
      //not supported by all browsers
      jQuery.mobile.pushStateEnabled = false;
      //Solves phonegap issues with the back-button
      jQuery.mobile.phonegapNavigationEnabled = true;
      //no native datepicker will conflict with the jQM component
      jQuery.mobile.page.prototype.options.degradeInputs.date = true;
    });

    require([
        'backbone',
        'jquerymobile',
        'fastclick',
        'routers/router',
        'models/app',
        'models/user',
        'models/species',
        'models/record',
        'helpers',
        'data'],
      function (Backbone, mobile, FastClick, Router, App, User, Species, Record) {
        //overwrite morel user append function to match backbone
        window.morel.auth.getUser = function () {
          return app.models.user.attributes;
        };

        //init data
        app.models = {};
        app.models.user = new User();
        app.models.app = new App();
        app.models.record = new Record();
        app.collections = {};
        app.collections.species = new Species(app.data.species);

        app.checkForUpdates();

        app.router = new Router();
        Backbone.history.start();

        app.fixIOSbuttons();
        FastClick.attach(document.body);

        $('.loading').css('display', 'none');
      });

  });
})();