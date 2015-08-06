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

        template: app.templates.record_multi_occurrences_list_item,

        initialize: function () {
            _log('views.RecordMultiOccurrencesListItem: initialize', log.DEBUG);

            this.render();
            this.appendEventListeners();
        },

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
            var stages = {},
                ranges = function (val) {
                    var range = '';
                    for (range in morel.Occurrence.KEYS.NUMBER.values) {
                        if (morel.Occurrence.KEYS.NUMBER.values[range] === val) {
                            return range;
                        }
                    }
                };
            stages.Ad = ranges(this.model.get('adult'));
            stages.Co = ranges(this.model.get('copulating'));
            stages.Ov = ranges(this.model.get('ovipositing'));
            stages.La = ranges(this.model.get('larvae'));
            stages.Ex = ranges(this.model.get('exuviae'));
            stages.Em = ranges(this.model.get('emergent'));
            template_data.stages = stages;

            var comment = this.model.get('comment');
            var ellipsis = comment && comment.length > 20 ? '...' : '';
            template_data.comment = comment ? comment.substring(0, 20) + ellipsis : ''; //cut it down a bit

            template_data.img = this.model.images.getFirst();

            this.$el.html(this.template(template_data));

            this.$imgPickerFile = this.$el.find('.img-picker-file');
            this.$imgPickerDisplay = this.$el.find('.img-picker-display');

            return this;
        },

        appendEventListeners: function () {
            //attach event listeners
            var that = this;

            this.$imgPickerFile.change(function () {
                $.mobile.loading('show');

                var callback = function (err, data, fileType) {
                    morel.Image.resize(data, fileType, 800, 800, function (err, image, data) {
                        that.model.images.set(new morel.Image(data));

                        that.$imgPickerDisplay.empty().append(image);
                        that.$imgPickerDisplay.addClass('selected');

                        $.mobile.loading('hide');
                    });
                };

                morel.Image.toString(this.files[0], callback);

                return false;
            });
        }
    });

    return View;
});
