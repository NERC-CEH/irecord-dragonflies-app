/******************************************************************************
 * List view of the Multi Record Species List used in ListPage view.
 *****************************************************************************/
define([
  'backbone',
  'views/multiRecordSavedListItem',
  'templates'
], function (Backbone, MultiRecordSavedListItemView) {
  'use strict';

  var View = Backbone.View.extend({
    tagName: 'ul',

    attributes: {
      'data-role': 'listview'
    },

    /**
     * Initializes the species list view.
     */
    initialize: function () {
      _log('views.MultiRecordSpeciesList: initialize', log.DEBUG);

      this.listenTo(this.collection, 'change', this.update);
    },

    /**
     * Renders the species list.
     * @returns {SpeciesListView}
     */
    render: function () {
      _log('views.MultiRecordSpeciesList: render ', log.DEBUG);

      var container = document.createDocumentFragment(); //optimising the performance

      if (this.collection.length) {
        _.each(this.collection.models, function (specie) {
          var item = new MultiRecordSavedListItemView({model: specie});
          container.insertBefore(item.render().el, container.firstChild);
        });

        this.$el.html(container); //appends to DOM only once
        this.$el.listview().listview('refresh');

        //attach listeners
        $('.multi-record-saved-species-remove').on('click', function () {
          _log('views.MultiRecordSpeciesList: removing saved species.', log.DEBUG);

          var id = $(this).data('id');
          id = parseInt(id);

          app.models.multiRecord.removeRecord(id);
        });
      } else {
        //todo: move this to template and out of 'ul'
        this.$el.html('<div class="info-message"> ' +
        '<p>No species has been selected to the list. Please add some' +
        'using the plus button above.</p> ' +
        '</div>');
     }

      return this;
    },

    update: function () {
      _log('MultiRecordSpeciesList: updating', log.DEBUG);

      this.render();
    }
  });

  return View;
});
