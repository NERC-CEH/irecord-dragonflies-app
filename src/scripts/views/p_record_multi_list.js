/******************************************************************************
 * List page view.
 *****************************************************************************/
define([
    'views/_page',
    'views/record_multi_list',
    'views/list_controls',
    'templates'
], function (DefaultPage, ListView, ListControlsView) {
    'use strict';

    var Page = DefaultPage.extend({
        id: 'record-multi-list',

        template: app.templates.p_record_multi_list,

        events: {
            'click #list-controls-save-button': 'toggleListControls',
            'click #list-controls-button': 'toggleListControls',
            'change input[type=radio]': 'toggleListControls'
        },

        initialize: function () {
            _log('views.RecordMultiListPage: initialize', log.DEBUG);

            this.$listControlsButton = this.$el.find('#list-controls-button');

            //todo: enable list controls
            //this.listControlsView = new ListControlsView(this.$listControlsButton);
            this.listControlsView = new (Backbone.View.extend({
                toggleListControls: function () {
                    app.message('<center><b>Disabled</b></center>', 500);
                },
                updateListControlsButton: function (){}
            }))();

            this.render();
            this.appendEventListeners();

            this.$userPageButton = $('#user-page-button');
        },

        render: function () {
            _log('views.RecordMultiListPage: render', log.DEBUG);

            this.$el.html(this.template());

            $('body').append($(this.el));

            //add list controls
            this.$listControls = this.$el.find('#list-controls-placeholder');
            this.$listControls.html(this.listControlsView.el);
            this.$list = this.$el.find('#record-multi-list-placeholder');

            return this;
        },

        renderList: function () {
            var speciesCollection = this.getPreparedSpeciesList();

            this.listView = new ListView({
                collection: speciesCollection
            });
            this.$list.html(this.listView.render().el);
            this.$list.trigger('create');
            return this.listView;
        },

        update: function () {
            //assign the model if new
            if (!this.model) {
                if (!app.models.sampleMulti) {
                    app.models.sampleMulti = new morel.Sample();
                }
                this.model = app.models.sampleMulti;
                this.collection = this.model.occurrences;

                this.collection.on('update', this.renderList, this);
                this.renderList();

            //if working on new sample then update the model
            } else if (this.model.id !== app.models.sampleMulti.id) {
                this.model = app.models.sampleMulti;
                this.collection = this.model.occurrences;

                this.collection.on('update', this.renderList, this);
                this.renderList();
            }
        },

        getPreparedSpeciesList: function () {
            var species = new Backbone.Collection(),
                specie = null,
                occurrence = null;

            //view is unhappy if collection is just copied
            app.collections.species.each(function (model) {
                species.add(model);
            });

            //remove saved ones
            for (var i = 0; i < this.collection.length; i++) {
                occurrence = this.collection.data[i];
                specie = species.find(function(model) {
                    return model.get('warehouse_id') === occurrence.get('taxon');
                });
                if (specie) {
                    species.remove(specie);
                }
            }

            return species;
        },

        appendEventListeners: function () {
            this.listenTo(app.models.user, 'change:filters', this.listControlsView.updateListControlsButton);

            $('.record-multi-list-img').on('click', function (e) {
                //stop propagation of jqm link
                e.stopPropagation();
                e.preventDefault();

                var id = $(this).data('id');
                Backbone.history.navigate('species/' + id, {trigger: true});
            });

            this.appendBackButtonListeners();
        },

        /**
         * Shows/hides the list controls.
         */
        toggleListControls: function () {
            this.listControlsView.toggleListControls();
        }
    });

    return Page;
});
