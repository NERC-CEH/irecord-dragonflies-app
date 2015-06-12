/******************************************************************************
 * Multi Record Saved list.
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

    template: app.templates.multi_record_saved_list_item,

    /**
     * Renders the individual list item representing the species.
     *
     * @returns {SpeciesListItemView}
     */
    render: function () {
      var warehouse_id = this.model.attributes[morel.record.inputs.KEYS.TAXON];
      var specie = app.collections.species.find(function (model) {
        return model.get('warehouse_id') === warehouse_id;
      });
      this.$el.html(this.template(specie.attributes));
      return this;
    }
  });

  return View;
});
