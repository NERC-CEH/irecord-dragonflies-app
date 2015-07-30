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

    attributes: {
      "data-corners": false,
      "data-shadow": false,
      "data-iconshadow": true,
      "data-wrapperels": "div",
      "data-icon": "arrow-r",
      "data-iconpos": "right",
      "data-theme": "c"
    },

    template: app.templates.record_multi_list_item,

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
