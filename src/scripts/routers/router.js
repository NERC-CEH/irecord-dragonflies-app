/******************************************************************************
 * Main app router.
 *****************************************************************************/
define([
    'routers/router_extension',
    'views/_page',
    'views/p_list',
    'views/p_species',
    'views/p_user',
    'views/p_login',
    'views/p_register',
    'views/p_record',
    'views/p_record_multi',
    'views/p_record_multi_occurrences',
    'views/p_record_multi_occurrences_edit',
    'views/p_record_multi_list',
    'views/p_date',
    'views/p_location',
    'views/p_number',
    'views/p_stage',
    'views/p_comment',
    'helpers/browser'
], function(ext, Page, ListPage, SpeciesPage, UserPage, LoginPage, RegisterPage,
            RecordPage, RecordMultiPage, RecordMultiOccurrencesPage, RecordMultiOccurrencesEditPage,
            RecordMultiListPage, DatePage, LocationPage, NumberPage, StagePage,
            CommentPage, browser) {
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

            "list(/:multi)": {
                route: function (multi) {
                    if (multi) {
                        if (!app.views.recordMultiListPage) {
                            app.views.recordMultiListPage = new RecordMultiListPage();
                        }
                        this.changePage(app.views.recordMultiListPage);

                        app.views.recordMultiListPage.update();

                    //normal list
                    } else {
                        if (!app.views.listPage) {
                            app.views.listPage = new ListPage();
                        }
                        this.changePage(app.views.listPage);

                        app.views.listPage.update();
                    }
                },
                after: function (multi) {
                    //leaving out safari home mode because it creates a nasty glitch on 8.3
                    if (!(browser.isIOS() && browser.isHomeMode())) {
                        var scroll = !multi ? app.views.listPage.scroll : app.views.recordMultiListPage.scroll;
                        if (scroll) {
                            window.scrollTo(0, scroll);
                        }
                    }
                },
                leave: function (multi) {
                    if (multi) {
                        app.views.recordMultiListPage.scroll = $(window).scrollTop();
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

                app.views.speciesPage.update(parseInt(id));
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

            "location(/:multi)": function (multi) {
                if (!app.views.locationPage) {
                    app.views.locationPage = new LocationPage();
                }
                this.changePage(app.views.locationPage);
                app.views.locationPage.update(multi ? app.models.sampleMulti : app.models.sample);
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

            "comment/:multi(/:id)": function (multi, id) {
                var model = id ? app.models.sampleMulti.occurrences.get(id) :
                        app.models.sampleMulti;

                if (!app.views.commentPage) {
                    app.views.commentPage = new CommentPage();
                }
                this.changePage(app.views.commentPage);

                app.views.commentPage.update(model);
            },

            "comment": function () {
                var model = app.models.sample;

                if (!app.views.commentPage) {
                    app.views.commentPage = new CommentPage();
                }
                this.changePage(app.views.commentPage);

                app.views.commentPage.update(model);
            },

            "date(/:multi)": function (multi) {
                if (!app.views.datePage) {
                    app.views.datePage = new DatePage();
                }
                this.changePage(app.views.datePage);
                app.views.datePage.update(multi ? app.models.sampleMulti : app.models.sample);
            },

            "record/multi": function () {
                if (!app.views.recordMultiPage) {
                    app.views.recordMultiPage = new RecordMultiPage();
                }
                var prevPageID = $.mobile.activePage ? $.mobile.activePage.attr('id') : '';

                this.changePage(app.views.recordMultiPage);
                app.views.recordMultiPage.update(prevPageID);
            },

            "record/multi/occurrences/:id(/:speciesID)": function (id, speciesID) {
                //existing occurrence
                if (!speciesID) {
                    if (!app.views.recordMultiOccurrencesEditPage) {
                        app.views.recordMultiOccurrencesEditPage = new RecordMultiOccurrencesEditPage();
                    }
                    this.changePage(app.views.recordMultiOccurrencesEditPage);
                    app.views.recordMultiOccurrencesEditPage.update(id);

                //make new occurrence
                } else {
                    if (!app.views.recordMultiOccurrencesEditPage) {
                        app.views.recordMultiOccurrencesEditPage = new RecordMultiOccurrencesEditPage();
                    }
                    this.changePage(app.views.recordMultiOccurrencesEditPage);
                    app.views.recordMultiOccurrencesEditPage.update(null, parseInt(speciesID));
                }
            },

            "record/multi/occurrences": function () {
                if (!app.views.recordMultiOccurrencesPage) {
                    app.views.recordMultiOccurrencesPage = new RecordMultiOccurrencesPage();
                }
                this.changePage(app.views.recordMultiOccurrencesPage);
                app.views.recordMultiOccurrencesPage.update();
            },

            "record/:id": function (id) {
                if (!app.views.recordPage) {
                    app.views.recordPage = new RecordPage();
                }
                var prevPageID = $.mobile.activePage ? $.mobile.activePage.attr('id') : '';

                this.changePage(app.views.recordPage);
                app.views.recordPage.update(prevPageID, parseInt(id));
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