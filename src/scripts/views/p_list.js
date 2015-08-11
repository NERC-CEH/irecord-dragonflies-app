/******************************************************************************
 * List page view.
 *****************************************************************************/
define([
    'views/_page',
    'views/list',
    'views/list_controls',
    'helpers/download',
    'helpers/browser',
    'tripjs',
    'templates'
], function (DefaultPage, ListView, ListControlsView, download, browser) {
    'use strict';

    var Page = DefaultPage.extend({
        id: 'list',

        template: app.templates.p_list,

        events: {
            'click #list-controls-save-button': 'toggleListControls',
            'click #list-controls-button': 'toggleListControls',
            'change input[type=radio]': 'toggleListControls'
        },

        initialize: function () {
            _log('views.ListPage: initialize', log.DEBUG);

            this.render();
            this.appendEventListeners();

            this.$userPageButton = $('#user-page-button');

            this.trip();
        },

        render: function () {
            _log('views.ListPage: render', log.DEBUG);

            this.$el.html(this.template());

            this.$list = this.$el.find('#list-placeholder');
            this.renderList();

            $('body').append($(this.el));

            //add list controls
            this.$listControlsButton = this.$el.find('#list-controls-button');
            this.listControlsView = new ListControlsView();

            var $listControls = this.$el.find('#list-controls-placeholder');
            $listControls.html(this.listControlsView.el);

            return this;
        },

        renderList: function () {
            this.listView = new ListView({collection: app.collections.species});
            this.$list.html(this.listView.render().el);
            return this.listView;
        },

        update: function () {
            this.updateListControlsButton();
            this.updateUserPageButton();
        },

        appendEventListeners: function () {
            this.listenTo(app.models.user, 'change:filters', this.updateListControlsButton);

            this.appendBackButtonListeners();
        },

        /**
         * Shows/closes list controls.
         */
        toggleListControls: function (e) {
            if (this.listControlsView.$el.is(":hidden")) {
                this.listControlsView.$el.slideDown("slow");
            } else {
                this.listControlsView.$el.slideUp("slow");
            }
        },

        /**
         * Updates the list controls button with the current state of the filtering.
         * If one or more filters is turned on then the button is
         * coloured accordingly.
         */
        updateListControlsButton: function () {
            var filters = app.models.user.get('filters');
            var activate = false;
            _.each(filters, function (filterGroup, filterGroupID){
                if (filterGroup.length > 0) {
                    activate = true;
                }
            });

            $(this.$listControlsButton.selector).toggleClass('running', activate);
        },

        /**
         * Updates the user page navigation button with the state of saved records.
         * Todo: hook into some record counter event
         */
        updateUserPageButton: function () {
            var $userPageButton = this.$userPageButton;

            function onSuccess(err, savedRecords) {
                var savedRecordIDs = Object.keys(savedRecords);
                $userPageButton.toggleClass('running', savedRecordIDs.length > 0);
            }
            app.recordManager.getAll(onSuccess);
        },

        /**
         * Shows the user around the page.
         */
        trip: function () {
            var callback = this.listTrip;

            if(browser.isMobile() && !browser.isHomeMode()) {
                var finishedTrips = app.models.user.get('trips') || [];

                //run trip only once
                if (finishedTrips.indexOf('welcome') < 0) {
                    setTimeout(function(){
                        var finishedBtnCloseId = 'finished-ok-button';

                        var addingToHomeScreen = '<p>1. Open <strong>Browser Options</strong></p>' +
                            '<p>2. Tap <strong>Add to Home Screen</strong></p>';

                        if(browser.isIOS()){
                            addingToHomeScreen =
                                '<img id="safari-add-homescreen" src="images/add_homescreen.png">';
                        }

                        var message =
                            '<center><h2>Add to Homescreen</h2></center>' +
                            addingToHomeScreen +
                            '<button id="' + finishedBtnCloseId + '">OK</button>';

                        app.message(message, 0);

                        $('#' + finishedBtnCloseId ).on('click', function () {
                            finishedTrips.push('welcome');
                            app.models.user.set('trips', finishedTrips);
                            app.models.user.save();

                            if (app.CONF.OFFLINE.STATUS) {
                                download(callback);
                            } else {
                                $.mobile.loading('hide');
                                callback && callback();
                            }
                        });
                    }, 500);
                } else {
                    setTimeout(function() {
                        download(callback);
                    }, 500);
                }
                return;
            }

            //in case the home screen mode was not detected correctly
            if (app.CONF.OFFLINE.STATUS) {
                setTimeout(download, 500);
            }
        },

        listTrip: function () {
            var finishedTrips = app.models.user.get('trips') || [];

            if (finishedTrips.indexOf('list') < 0) {
                finishedTrips.push('list');
                app.models.user.set('trips', finishedTrips);
                app.models.user.save();

                setTimeout(function () {
                    trip.start();
                }, 500);
            }

            var options = {
                delay: 1500
            };

            var trip = new Trip([
                {
                    sel: $('#user-page-button'),
                    position: "s",
                    content: 'Your Account',
                    animation: 'fadeIn'
                },
                {
                    sel: $('#fav-button'),
                    position: "s",
                    content: 'List Controls',
                    animation: 'fadeIn'
                },
                {
                    sel: $('a[href="#species/11"]'),
                    position: "s",
                    content: 'Species Account',
                    animation: 'fadeIn'
                },
                {
                    sel: $('a[href="#record/11"]'),
                    position: "w",
                    content: 'Recording',
                    animation: 'fadeIn'
                }
            ], options);
        }
    });

    return Page;
});
