/******************************************************************************
 * User page view.
 *****************************************************************************/
define([
    'views/_page',
    'views/dialog_user_details',
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
            'click .delete-button': 'deleteSavedRecord'
        },

        initialize: function () {
            _log('views.UserPage: initialize', log.DEBUG);

            this.model = app.models.user;

            this.render();
            this.appendEventListeners();
        },

        render: function () {
            _log('views.UserPage: render', log.DEBUG);

            this.$el.html(this.template());
            $('body').append($(this.el));

            this.$loginWarning = this.$el.find('#login-warning');
            this.$list = this.$el.find('#samples-list-placeholder');
            this.$heading = this.$el.find('#user_heading');

            this.renderUserControls();
            this.renderList();

            return this;
        },

        renderList: function () {
            var that = this;
            app.recordManager.getAll(function (err, samples) {
                if (err) {
                    app.message(err.message);
                    return;
                }
                that.listView = new SamplesList({
                    collection: samples
                });
                that.$list.html(that.listView.el);
            });
        },

        /**
         * Renders the user login information.
         */
        renderUserControls: function () {
            if (app.models.user.hasSignIn()){
                //logged in
                var name = app.models.user.get('name');
                var surname = app.models.user.get('surname');
                this.$heading.html(name + ' ' + surname);
                this.$loginWarning.hide();
            } else {
                //logged out
                this.$heading.html('My Account');
                this.$loginWarning.show();
            }
        },

        appendEventListeners: function () {
            this.appendBackButtonListeners();
            this.listenTo(this.model, 'change:secret', this.renderUserControls);
        },

        /**
         * Recursively sends all the saved user records.
         */
        syncAll: function (e) {
            var $button = $(e.currentTarget);

            function onSuccess() {
               // app.views.userPage.renderList();
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
                $button.addClass('sync-icon-reload');
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
                sampleID = $button.data('id');

            var callback = null;
            if (navigator.onLine) {
                //online
                app.recordManager.get(sampleID, function (err, sample) {
                    callback = function (err) {
                        if (err) {
                            var message =
                                "<center><h2>Error</h2></center> <br/>" +
                                err.message || '<h3>Some problem occurred </h3>';

                            app.message(message);
                            return;
                        }
                    };

                    if (app.models.user.hasSignIn()) {
                        //append user details
                        sample.set('name', app.models.user.get('name'));
                        sample.set('surname', app.models.user.get('surname'));
                        sample.set('email', app.models.user.get('email'));
                        app.recordManager.sync(sample, callback);
                    } else {
                        contactDetailsDialog(function (email, name, surname) {
                            //append user details
                            sample.set('name', name);
                            sample.set('surname', surname);
                            sample.set('email', email);
                            app.recordManager.sync(sample, callback);
                        });
                    }
                });
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
            app.recordManager.remove(recordKey);
        }
    });

    var SamplesList = Backbone.View.extend({
        template: app.templates.samples_list,

        initialize: function () {
            this.render();
            //update view on saved samples update
            this.collection.on('update', this.render, this);
        },

        render: function () {
            this.$el.html(this.template());
            this.$list = this.$el.find('#samples-list');
            this.renderList();
            this.$list.listview().listview('refresh');
        },

        renderList: function () {
            var that = this;
            this.collection.each(function (sample) {
                var sampleView = new SamplesListItem({
                    model: sample
                });
                that.$list.append(sampleView.el);
            });
        }
    });

    var SamplesListItem = Backbone.View.extend({
        tagName: "li",

        template: app.templates.samples_list_item,

        initialize: function () {
            this.render();
            this.$syncButton = this.$el.find('.sync');

            this.showSyncStatus();
            this.model.on('change', this.render, this);
            this.model.on('sync:done', this.showSyncStatus, this);
            this.model.on('sync:error', this.showSyncStatus, this);
            this.model.on('sync:request', this.showSync, this);

        },

        render: function () {
            var templateData = {};
            templateData.id = this.model.id;
            templateData.date = this.model.get('date');

            if (this.model.occurrences.length <= 1) {
                var occurrence = this.model.occurrences.getFirst(),
                    speciesID = occurrence.get('taxon');
                var specie = app.collections.species.find({id: speciesID});
                templateData.common_name = specie ? specie.attributes.common_name : '';

                templateData.img = occurrence.images.getFirst();

                //multi record
            } else {
                templateData.multiRecord = this.model.occurrences.length;
            }

            this.$el.html(this.template(templateData));
            //trigger create
        },

        showSyncStatus: function () {
            if (this.model.warehouse_id) {
                //on cloud
                this.$syncButton.removeClass('sync-icon-reload');
                this.$syncButton.removeClass('sync-icon-local');
                this.$syncButton.addClass('sync-icon-cloud');
            } else {
                //local
                this.$syncButton.removeClass('sync-icon-reload');
                this.$syncButton.removeClass('sync-icon-cloud');
                this.$syncButton.addClass('sync-icon-local');
            }
        },

        showSync: function () {
            this.$syncButton.removeClass('sync-icon-local');
            this.$syncButton.removeClass('sync-icon-cloud');
            this.$syncButton.addClass('sync-icon-reload');
        }
    });

    return Page;
});
