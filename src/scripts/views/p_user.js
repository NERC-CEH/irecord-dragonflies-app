/******************************************************************************
 * User page view.
 *****************************************************************************/
define([
    'views/_page',
    'views/contact_details_dialog',
    'templates',
    'latlon'
], function (DefaultPage, contactDetailsDialog) {
    'use strict';

    var Page = DefaultPage.extend({
        id: 'user',

        template: app.templates.p_user,

        events: {
            'click #syncAll-button': 'syncAll',
            'click .sync': 'sync',
            'click .delete-button': 'deleteSavedRecord',
            'click #logout-button': 'signOut'
        },

        initialize: function () {
            _log('views.UserPage: initialize', log.DEBUG);

            this.render();
            this.appendEventListeners();
        },

        render: function () {
            _log('views.UserPage: render', log.DEBUG);

            this.$el.html(this.template());
            $('body').append($(this.el));

            return this;
        },

        update: function () {
            this.printUserControls();
            this.printList();
        },

        appendEventListeners: function () {
            this.listenTo(app.models.user, 'change:location', this.update);

            this.appendBackButtonListeners();
        },

        /**
         * Recursively sends all the saved user records.
         */
        syncAll: function (e) {
            var $button = $(e.currentTarget);
            $button.addClass('sync-icon-reload');

            function onSuccess() {
                app.views.userPage.printList();
            }

            function callback(err) {
                $button.removeClass('sync-icon-reload');
                if (err) {
                    var message =
                        "<center><h2>Error</h2></center> <br/>" +
                        err.message || '<h3>Some problem occurred </h3>';

                    app.message(message);
                    return;
                }
                app.views.listPage.updateUserPageButton();
            }

            if (app.models.user.hasSignIn()) {
                app.recordManager.syncAll(onSuccess, callback);
            } else {
                contactDetailsDialog(function () {
                    $button.addClass('sync-icon-reload');
                    app.recordManager.syncAll(onSuccess, callback);
                });
            }
        },

        /**
         * Sends the saves user record.
         *
         * @param e Event of an element that contains the ID of the saved record as
         * data attribute.
         */
        sync: function (e) {
            var $button = $(e.currentTarget),
                recordKey = $button.data('id');

            var callback = null;
            if (navigator.onLine) {

                $button.addClass('sync-icon-reload');
                //online
                callback = function (err) {
                    $button.removeClass('sync-icon-reload');

                    if (err) {
                        var message =
                            "<center><h2>Error</h2></center> <br/>" +
                            error.message || '<h3>Some problem occurred </h3>';

                        app.message(message);
                        return;
                    }
                };

                if (app.models.user.hasSignIn()) {
                    app.recordManager.sync(recordKey, callback);
                } else {
                    contactDetailsDialog(function () {
                        $button.addClass('sync-icon-reload');
                        app.recordManager.sync(recordKey, callback);
                    });
                }
            } else {
                //offline
                app.message("<center><h2>Sorry</h2></center>" +
                    "<br/><h3>Looks like you are offline!</h3>");
            }
        },

        /**
         * Deletes the saves user record.
         *
         * @param e Event of an element that contains the ID of the saved record as
         * data attribute.
         */
        deleteSavedRecord: function (e) {
            //stop propagation of jqm link
            e.stopPropagation();
            e.preventDefault();

            var recordKey = $(e.currentTarget).data('id');
            app.recordManager.remove(recordKey, function () {
                app.views.userPage.printList();
            });
        },

        /**
         * Renders the user login information.
         */
        printUserControls: function () {
            var $logoutButton = $('#logout-button');
            var $loginWarning = $('#login-warning');

            if (app.models.user.hasSignIn()){
                //logged in
                var name = app.models.user.get('name');
                var surname = app.models.user.get('surname');
                $('#user_heading').html(name + ' ' + surname);

                $logoutButton.show();
                $loginWarning.hide();
            } else {
                //logged out
                $('#user_heading').html('My Account');

                $logoutButton.hide();
                $loginWarning.show();
            }
        },

        /**
         * Renders the list of the saved records.
         */
        printList: function () {
            function callback(err, savedRecords) {
                var $placeholder = $('#saved-list-placeholder');

                if (err) {
                    $placeholder.html('Error getting saved records');
                    return;
                }

                var records = [],
                    flatRecord = {},
                    inputKeys = {},
                    savedRecordIDs = Object.keys(savedRecords);
                for (var i = 0, length = savedRecordIDs.length; i < length; i++) {
                    var record = savedRecords[savedRecordIDs[i]],
                        templateData = {};
                    templateData.id = record.id;
                    templateData.date = record.get('date');

                    if (record.occurrences.length <= 1) {
                        var occurrence = savedRecords[record.id]
                            .occurrences.getFirst(),
                            taxon = occurrence.get('taxon');
                        var specie = app.collections.species.find(function(model) {
                            return model.get('warehouse_id') === taxon;
                        });
                        templateData.common_name = specie ? specie.attributes.common_name : '';

                        templateData.img = occurrence.images.getFirst();

                    //multi record
                    } else {
                        templateData.multiRecord = record.occurrences.length;
                    }

                    records.push(templateData);
                }

                $placeholder.html(app.templates.saved_records({'records': records}));
                $placeholder.trigger('create');
            }

            app.recordManager.getAll(callback);
        },

        /**
         * Signs the user out.
         */
        signOut: function () {
            _log('user: logging out', log.DEBUG);
            app.models.user.signOut();
            this.update();
        }
    });

    return Page;
});
