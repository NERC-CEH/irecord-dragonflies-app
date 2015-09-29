/******************************************************************************
 * List page view.
 *****************************************************************************/
define([
    'views/_page',
    'views/list',
    'views/list_controls',
    'views/dialog_download',
    'views/dialog_add_homescreen',
    'helpers/browser',
    'tripjs',
    'templates'
], function (DefaultPage, ListView, ListControlsView, download, addHomescreenDialog,
             browser) {
    'use strict';

    var Page = DefaultPage.extend({
        id: 'list',

        template: app.templates.p_list,

        events: {
            'click #list-controls-save-button': 'toggleListControls',
            'click #list-controls-button': 'toggleListControls',
            'change input[type=radio]': 'toggleListControls',
            'click #download-button': 'tripDownload'
        },

        initialize: function () {
            _log('views.ListPage: initialize', log.DEBUG);

            this.render();
            this.appendEventListeners();

            this.$userPageButton = $('#user-page-button');
            this.updateUserPageButton();

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

            //disable/enable downloading
            this.$footer = this.$el.find('#list-footer');

            var downloaded = app.models.user.get('downloaded-app');
            if (downloaded) {
                this.$footer.hide();

            //silent desktop download
            } else if (!browser.isMobile()) {
                this.$footer.hide();
                download(null, true);
            }

            return this;
        },

        renderList: function () {
            this.listView = new ListView({collection: app.collections.species});
            this.$list.html(this.listView.render().el);
            return this.listView;
        },

        update: function () {
            this.updateListControlsButton();
        },

        appendEventListeners: function () {
            this.listenTo(app.models.user, 'change:filters', this.updateListControlsButton);
            app.recordManager.on('update', this.updateUserPageButton, this);
            app.recordManager.on('sync:done', this.updateUserPageButton, this);
            this.appendBackButtonListeners();
        },

        /**
         * Shows/closes list controls.
         */
        toggleListControls: function (e) {
            if (this.listControlsView.$el.is(":hidden")) {
                this.listControlsView.$el.slideDown("slow");
                this.$list.addClass("ui-state-disabled");
            } else {
                this.$list.removeClass("ui-state-disabled");
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
         */
        updateUserPageButton: function () {
            _log('views.ListPage: updating user button.', log.DEBUG);
            var that = this;

            function onSuccess(err, samples) {
                var unsent = 0;
                samples.each(function (sample) {
                    if (sample.getSyncStatus() === morel.LOCAL) unsent++;
                });
                that.$userPageButton.toggleClass('running', unsent > 0);
            }
            app.recordManager.getAll(onSuccess);
        },

        /**
         * Shows the user around the page.
         */
        trip: function () {
            var callback = function () {
                app.views.listPage.$footer.hide();
            };
            var downloaded = app.models.user.get('downloaded-app');
            if (!downloaded && browser.isIOS() && browser.isHomeMode()) {
                download(callback);
            }
        },

        tripDownload: function () {
            var callback = function () {
                app.views.listPage.$footer.hide();
            };
            addHomescreenDialog(function () {
                if (app.CONF.OFFLINE.STATUS) {
                    download(callback);
                }
            });
        }
    });

    return Page;
});
