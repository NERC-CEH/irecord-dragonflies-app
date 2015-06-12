/******************************************************************************
 * Main app router.
 *****************************************************************************/
define([
  'routers/routerExtention',
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
  'views/commentPage',
  'views/multiRecordInfoPage',
  'views/multiRecordPage',
  'views/multiRecordListPage',
  'views/multiRecordSpeciesPage',
  'helpers/browser'
], function(ext, Page, ListPage, SpeciesPage, UserPage, LoginPage, RegisterPage,
            RecordPage, DatePage, LocationPage, NumberPage, StagePage,
            CommentPage, MultiRecordInfoPage, MultiRecordPage, MultiRecordListPage,
            MultiRecordSpeciesPage, browser) {
  'use strict';

  app.views = {};

  var Router = Backbone.Router.extend({
    /**
     * Initialize the router.
     */
    initialize: function () {
      _log('app.Router: initialize.', log.DEBUG);

      //track every route change as a page view in google analytics
      this.bind('route', this.trackPageview);
    },

    /**
     * Routes to listen to.
     */
    routes: {
      "": function () {
        if (!app.views.listPage) {
          app.views.listPage = new ListPage();
        }
        this.changePage(app.views.listPage);
      },

      "list(/:record)": {
        route: function (record) {
          record = record === 'record';

          if (record) {
            if (!app.views.multiRecordListPage) {
              app.views.multiRecordListPage = new MultiRecordListPage({record: record});
            }
            this.changePage(app.views.multiRecordListPage);

            app.views.multiRecordListPage.update(record);
          } else {
            if (!app.views.listPage) {
              app.views.listPage = new ListPage({record: record});
            }
            this.changePage(app.views.listPage);

            app.views.listPage.update(record);
          }
       },
        after: function (record) {
          //leaving out safari home mode because it creates a nasty glitch on 8.3
          if (!(browser.isIOS() && browser.isHomeMode())) {
            var scroll = !record ? app.views.listPage.scroll : app.views.multiRecordListPage.scroll;
            if (scroll) {
              window.scrollTo(0, scroll);
            }
          }
        },
        leave: function (record) {
          if (record) {
            app.views.multiRecordListPage.scroll = $(window).scrollTop();
          } else {
            app.views.listPage.scroll = $(window).scrollTop();
          }
        }
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

      "multi-record-info": function () {
        if (!app.views.multiRecordInfoPage) {
          app.views.multiRecordInfoPage = new MultiRecordInfoPage();
        }
        this.changePage(app.views.multiRecordInfoPage);
      },

      "multi-record": function () {
        if (!app.views.multiRecordPage) {
          app.views.multiRecordPage = new MultiRecordPage();
        }
        this.changePage(app.views.multiRecordPage);
      },

      "multi-record-species/:id": function (id) {
        if (!app.views.multiRecordSpeciesPage) {
          app.views.multiRecordSpeciesPage = new MultiRecordSpeciesPage();
        }
        this.changePage(app.views.multiRecordSpeciesPage);
        app.views.multiRecordSpeciesPage.update(id);
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

      "species-differences": function () {
        this.navigateToStandardPage('species-differences');
      },

      "species-anatomy": function () {
        this.navigateToStandardPage('species-anatomy');
      },

      "species-terms": function () {
        this.navigateToStandardPage('species-terms');
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

    /**
     * If the JQM page needs no controller and uses a rather static template
     * we can use this function to create the view and open it as a page.
     *
     * @param pageID the ID of a page that matches the template name
     */
    navigateToStandardPage: function (pageID) {
      if (!app.views[pageID + 'Page']) {
        app.views[pageID + 'Page'] = new Page(pageID);
      }
      this.changePage(app.views[pageID + 'Page']);
    },

    /**
     * Since the JQM page navigation is disabled with backbone this navigates to
     * a new page view.
     *
     * @param page backbone page view
     */
    changePage: function (page) {
      // We turned off $.mobile.autoInitializePage, but now that we've
      // added our first page to the DOM, we can now call initializePage.
      if (!this.initializedFirstPage) {
        _log('app.Router: loading first page.', log.DEBUG);

        $.mobile.initializePage();
        this.initializedFirstPage = true;
      }

      //update the URL hash
      $(":mobile-pagecontainer").pagecontainer("change", '#' + page.id,
        {changeHash: false});
    },

    /**
     * Google analytics to track the page navigation.
     */
    trackPageview: function () {
      //Google Analytics
      if (app.CONF.GA.STATUS) {
        require(['ga'], function(ga) {
          var url = Backbone.history.getFragment();

          // Add a slash if neccesary
          if (!/^\//.test(url)) url = '/' + url;

          // Record page view
          ga('send', {
            'hitType': 'pageview',
            'page': url
          });
        });
      }
    }
  });

  return Router;
});