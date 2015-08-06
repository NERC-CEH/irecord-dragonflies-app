/******************************************************************************
 * Species list control view used in ListPage view.
 *****************************************************************************/
define([
  'backbone',
  'templates'
], function (Backbone) {
  'use strict';

  var View = Backbone.View.extend({
    tagName: "li",

    template: app.templates.list_item,

    /**
     * Renders the individual list item representing the species.
     *
     * @returns {SpeciesListItemView}
     */
    render: function () {
      this.$el.html(this.template(this.model.attributes));
      return this;
    }
  });

  return View;
});
