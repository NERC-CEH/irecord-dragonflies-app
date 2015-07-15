/******************************************************************************
 * App object.
 *****************************************************************************/
define([
        'jquery',
        'jquery.mobile',
        'backbone',
        'fastclick',
        'klass',
        'morel',
        'routers/router',
        'models/app',
        'models/user',
        'models/species',
        'helpers/update',
        'helpers/brcart',
        'helpers/message',
        'helpers/log',
        'data'
    ],
    function ($, jqm, Backbone, FastClick, klass, morel, Router, AppModel, UserModel,
              SpeciesCollection, update, brcArt) {
        var App = {
            init: function () {
                //init Google Analytics
                //http://veithen.github.io/2015/02/14/requirejs-google-analytics.html
                if (app.CONF.GA.STATUS){
                    window.GoogleAnalyticsObject = "__ga__";
                    window.__ga__ = {
                        q: [["create", app.CONF.GA.ID, "auto"]],
                        l: Date.now()
                    };
                    require(['ga'], function(ga) {
                        ga('set', 'appName', app.NAME);
                        ga('set', 'appVersion', app.VERSION);
                    });
                }

                _log(brcArt, log.INFO);

                //overwrite morel user append function to match backbone
                morel.Auth.prototype.getUser = function () {
                    return app.models.user.attributes;
                };

                //init data
                app.recordManager = new morel.Manager(app.CONF.morel);

                app.models = {};
                app.models.user = new UserModel();
                app.models.app = new AppModel();
                app.models.sample = null; //to be set up on record opening
                app.collections = {};
                app.collections.species = new SpeciesCollection(app.data.species);

                //update app
                update();

                app.router = new Router();
                Backbone.history.start();

                //app.fixIOSbuttons();

                FastClick.attach(document.body);

                //turn off the loading splash screen
                $('div.loading').css('display', 'none');
                $('body').removeClass('loading');
            }
        };
        return App;
    });