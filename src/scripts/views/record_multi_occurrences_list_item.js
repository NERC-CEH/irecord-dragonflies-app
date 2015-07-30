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

        template: app.templates.record_multi_occurrences_list_item,

        /**
         * Renders the individual list item representing the species.
         *
         * @returns {SpeciesListItemView}
         */
        render: function () {
            var warehouse_id = this.model.get('taxon');
            var specie = app.collections.species.find(function (model) {
                return model.get('warehouse_id') === warehouse_id;
            });

            var template_data = $.extend({}, specie.attributes); //clone the object
            template_data.id = this.model.id;
            var stages = {};
            stages.Ad = this.model.get('adult');
            stages.Co = this.model.get('copulating');
            stages.Ov = this.model.get('ovipositing');
            stages.La = this.model.get('larvae');
            stages.Ex = this.model.get('exuviae');
            stages.Em = this.model.get('emergent');
            template_data.stages = stages;

            this.$el.html(this.template(template_data));
            return this;
        }
    });

    return View;
});
