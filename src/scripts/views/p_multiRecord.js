/******************************************************************************
 * Multi Record page view.
 *****************************************************************************/
define([
    'views/_page',
    'views/multiRecordSavedList',
    'templates',
    'morel',
    'conf'
], function(Page, MultiRecordSavedListView) {
    'use strict';

    var MultiRecordPage = Page.extend({
        id: 'multi-record',

        template: app.templates.p_multi_record,

        events: {
            'click #multi-save': 'save'
        },

        initialize: function () {
            _log('views.MultiRecordPage: initialize', log.DEBUG);

            this.render();
            this.appendEventListeners();
        },

        render: function () {
            _log('views.MultiRecordPage: render', log.DEBUG);

            this.$el.html(this.template());
            this.addList();

            $('body').append($(this.el));

            return this;
        },

        update: function () {

        },

        appendEventListeners: function () {
            app.models.sampleMulti.on('change', this.update, this);

            this.appendBackButtonListeners();
        },

        addList: function () {
            this.listView = new MultiRecordSavedListView({
                collection: app.models.sampleMulti.occurrences
            });
            this.$list = this.$el.find('#recorded-species-list');
            this.$list.html(this.listView.render().el);

            return this.listView;
        },

        save: function () {
            _log('views.RecordPage: saving record.', log.DEBUG);
            $.mobile.loading('show');

            if (!this.valid()) {
                return;
            }

            function callback(err) {
                if (err) {
                    var message = "<center><h2>Error</h2></center>" +
                        "<p>" + err.message + "</p>";
                    app.message(message);
                    return;
                }

                app.message("<center><h2>Record saved.</h2></center>");
                setTimeout(function () {
                    Backbone.history.navigate('list', {trigger: true});
                }, 2000);
            }

            app.recordManager.set(app.models.sampleMulti, callback);
        },

        valid: function () {
            return true;
        }
    });

    return MultiRecordPage;
});

