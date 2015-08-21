/******************************************************************************
 * List view of the Multi Record Species List used in ListPage view.
 *****************************************************************************/
define([
    'backbone',
    'views/record_multi_occurrences_list_item',
    'templates'
], function (Backbone, RecordMultiOccurrencesListItemView) {
    'use strict';

    var View = Backbone.View.extend({
        tagName: 'ul',

        attributes: {
            'data-role': 'listview',
            'class': 'listview-full'
        },

        /**
         * Initializes the species list view.
         */
        initialize: function () {
            _log('views.RecordMultiOccurrencesList: initialize', log.DEBUG);

            this.collection.on('change', this.update, this);
            this.collection.on('update', this.update, this);
        },

        /**
         * Renders the species list.
         * @returns {SpeciesListView}
         */
        render: function () {
            _log('views.RecordMultiOccurrencesList: render ', log.DEBUG);

            var container = document.createDocumentFragment(); //optimising the performance

            if (this.collection.length) {
                _.each(this.collection.data, function (occurrence) {
                    var item = new RecordMultiOccurrencesListItemView({
                        model: occurrence
                    });
                    container.insertBefore(item.el, container.firstChild);
                });

                this.$el.html(container); //appends to DOM only once
                this.$el.listview().listview('refresh');

                //attach listeners
                $('.record-multi-occurrences-remove').on('click', function () {
                    _log('views.RecordMultiOccurrencesList: removing saved occurrence.', log.DEBUG);

                    var id = $(this).data('id');
                    app.models.sampleMulti.occurrences.remove(id);
                });
                $('#empty-list-message').hide();
            } else {
                this.$el.empty();
                $('#empty-list-message').show();
            }

            return this;
        },

        update: function () {
            _log('views.RecordMultiOccurrencesList: updating', log.DEBUG);

            this.render();
        }
    });

    return View;
});
