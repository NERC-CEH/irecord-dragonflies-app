/******************************************************************************
 * User page view.
 *****************************************************************************/
define([
    'views/_page',
    'views/contactDetailsDialog',
    'templates',
    'latlon'
], function (Page, contactDetailsDialog) {
    'use strict';

    var UserPage = Page.extend({
        id: 'user',

        template: app.templates.p_user,

        events: {
            'click #syncAll-button': 'syncAll',
            'click .sync-button': 'sync',
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
            this.listenTo(app.models.user, 'change:email', this.update);

            this.appendBackButtonListeners();
        },

        /**
         * Recursively sends all the saved user records.
         */
        syncAll: function () {
            $.mobile.loading('show');

            function onSuccess() {
                app.views.userPage.printList();
            }

            function onSuccessAll() {
                $.mobile.loading('hide');
                app.views.listPage.updateUserPageButton();
            }

            if (app.models.user.hasSignIn()) {
                app.recordManager.syncAll(onSuccess, onSuccessAll);
            } else {
                contactDetailsDialog(function () {
                    $.mobile.loading('show');
                    app.recordManager.syncAll(onSuccess, onSuccessAll);
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
            var recordKey = $(e.currentTarget).data('id');

            var onSuccess = null, onError = null;
            if (navigator.onLine) {
                //online
                $.mobile.loading('show');

                onSuccess = function () {
                    //for some reason need a timeout
                    setTimeout(function () {
                        app.views.listPage.updateUserPageButton();
                    }, 100);

                    app.message("<center><h2>Done</h2></center>");

                    morel.record.db.remove(recordKey, function () {
                        app.views.userPage.printList();
                    });
                };

                onError = function (error) {
                    _log(error, log.ERROR);

                    var message =
                        "<center><h2>Error</h2></center> <br/>" +
                        error.message || '<h3>Some problem occurred </h3>';

                    app.message(message);
                };

                if (app.models.user.hasSignIn()) {
                    morel.io.sendSavedRecord(recordKey, onSuccess, onError);
                } else {
                    contactDetailsDialog(function () {
                        $.mobile.loading('show');
                        morel.io.sendSavedRecord(recordKey, onSuccess, onError);
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
                        var taxon = savedRecords[record.id]
                            .occurrences.getFirst()
                            .get('taxon');
                        var specie = app.collections.species.find(function(model) {
                            return model.get('warehouse_id') === taxon;
                        });
                        templateData.common_name = specie ? specie.attributes.common_name : '';

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

    return UserPage;
});
