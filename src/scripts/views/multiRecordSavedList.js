/******************************************************************************
 * List view of the species used in ListPage view.
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
      _log('views.SpeciesList: initialize', log.DEBUG);

      this.listenTo(this.collection, 'change', this.update);
    },

    /**
     * Renders the species list.
     * @returns {SpeciesListView}
     */
    render: function () {
      _log('views.SpeciesList: render ', log.DEBUG);

      var container = document.createDocumentFragment(); //optimising the performance

      _.each(this.collection.models, function (specie) {
        var item = new MultiRecordSavedListItemView({model: specie});
        container.appendChild(item.render().el);
      });

      this.$el.html(container); //appends to DOM only once
      this.$el.listview().listview('refresh');

      //attach listeners


      return this;
    },

    update: function () {
      _log('list: updating', log.DEBUG);

      this.render();
    }
  });

  return View;
});
