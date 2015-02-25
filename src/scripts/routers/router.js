define([
  'views/_page',
  'views/listPage',
  'views/speciesPage',
  'views/userPage',
  'views/loginPage',
  'views/registerPage',
  'views/recordPage',
  'views/datePage',
  'views/locationPage',
  'views/numberPage',
  'views/stagePage',
  'views/locationdetailsPage',
  'views/commentPage'
], function(Page, ListPage, SpeciesPage, UserPage, LoginPage, RegisterPage,
            RecordPage, DatePage, LocationPage, NumberPage, StagePage, LocationdetailsPage,
            CommentPage) {
  'use strict';

  app.views = {};

  var Router = Backbone.Router.extend({
    initialize: function () {
      _log('app.Router: initialize.', app.LOG_DEBUG);

      $(document).on("show", _.bind(this.handleshow, this));
    },

    routes: {
      "": function () {
        if (!app.views.listPage) {
          app.views.listPage = new ListPage();
        }
        this.changePage(app.views.listPage);
      },

      "list": function () {
        if (!app.views.listPage) {
          app.views.listPage = new ListPage();
        }
        this.changePage(app.views.listPage);
      },

      "species/:id": function (id) {
        if (!app.views.speciesPage) {
          app.views.speciesPage = new SpeciesPage();
        }
        this.changePage(app.views.speciesPage);

        app.views.speciesPage.update(id);
      },

      "user": function () {
        if (!app.views.userPage) {
          app.views.userPage = new UserPage();
        }
        this.changePage(app.views.userPage);

        app.views.userPage.update();
      },

      "terms": function () {
        this.navigateToStandardPage('terms');
      },

      "login": function () {
        if (!app.views.loginPage) {
          app.views.loginPage = new LoginPage();
        }
        this.changePage(app.views.loginPage);
      },

      "register": function () {
        if (!app.views.registerPage) {
          app.views.registerPage = new RegisterPage();
        }
        this.changePage(app.views.registerPage);
      },

      "record/:id": function (id) {
        if (!app.views.recordPage) {
          app.views.recordPage = new RecordPage({model: app.models.record});
        }
        var prevPageID = $.mobile.activePage ? $.mobile.activePage.attr('id') : '';

        this.changePage(app.views.recordPage);
        app.views.recordPage.update(prevPageID, id);
      },

      "location": function () {
        if (!app.views.locationPage) {
          app.views.locationPage = new LocationPage({model: app.models.record});
        }
        this.changePage(app.views.locationPage);
        app.views.locationPage.update();
      },

      "number": function () {
        if (!app.views.numberPage) {
          app.views.numberPage = new NumberPage({model: app.models.record});
        }
        this.changePage(app.views.numberPage);
      },

      "stage": function () {
        if (!app.views.stagePage) {
          app.views.stagePage = new StagePage({model: app.models.record});
        }
        this.changePage(app.views.stagePage);
      },

      "comment": function () {
        if (!app.views.commentPage) {
          app.views.commentPage = new CommentPage({model: app.models.record});
        }
        this.changePage(app.views.commentPage);
      },

      "date": function () {
        if (!app.views.datePage) {
          app.views.datePage = new DatePage({model: app.models.record});
        }
        this.changePage(app.views.datePage);
      },

      "info": function () {
        this.navigateToStandardPage('info');
      },

      "about": function () {
        this.navigateToStandardPage('about');
      },

      "species-info": function () {
        this.navigateToStandardPage('species-info');
      },

      "credits": function () {
        this.navigateToStandardPage('credits');
      },

      "privacy": function () {
        this.navigateToStandardPage('privacy');
      },

      "brc-approved": function () {
        this.navigateToStandardPage('brc-approved');
      }
    },

    navigateToStandardPage: function (pageID) {
      if (!app.views[pageID + 'Page']) {
        app.views[pageID + 'Page'] = new Page(pageID);
      }
      this.changePage(app.views[pageID + 'Page']);
    },

    changePage: function (page) {
      // We turned off $.mobile.autoInitializePage, but now that we've
      // added our first page to the DOM, we can now call initializePage.
      if (!this.initializedFirstPage) {
        _log('app.Router: loading first page.', app.LOG_DEBUG);

        $.mobile.initializePage();
        this.initializedFirstPage = true;

        //ask user to appcache
        //setTimeout(app.download, 1000);
      }

      $(":mobile-pagecontainer").pagecontainer("change", '#' + page.id,
        {changeHash: false});
    },

    handleshow: function (event, ui) {
      // Figure out what page we are showing and call 'app.views.Page.show' on it
      // TODO: JQM 1.4.3 has ui.toPage, which would be preferred to getActivePage
      var activePage = $(":mobile-pagecontainer").pagecontainer("getActivePage");
      _.each(this.pages, function (page) {
        if (activePage.get(0) === page.el) {
          page.show(event, ui);
        }
      });
    }
  });

  return Router;
});