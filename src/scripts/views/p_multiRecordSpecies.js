/******************************************************************************
 * Multi Record Species page view.
 *****************************************************************************/
define([
    'views/_page',
    'templates',
    'morel',
    'conf',
    'helpers/jqm-spinbox'
], function(Page) {
    'use strict';

    var MultiRecordSpeciesPage = Page.extend({
        id: 'multi-record-species',

        template: app.templates.p_multi_record_species,

        events: {
            'click #multi-record-species-save': 'save'
        },

        initialize: function () {
            _log('views.MultiRecordSpeciesPage: initialize', log.DEBUG);

            this.render();
            this.appendEventListeners();
        },

        render: function () {
            _log('views.MultiRecordSpeciesPage: render', log.DEBUG);

            this.$el.html(this.template());
            $('body').append($(this.el));

            return this;
        },

        update: function (occurrenceID, speciesID) {
            _log('views.MultiRecordSpeciesPage: updating', log.DEBUG);

            //needs to go back the history - twice if coming from list
            this.existingRecord = occurrenceID;

            if (occurrenceID) {
                this.model = app.models.sampleMulti.occurrences.get(occurrenceID); //state to see if the record already exists
            } else {
                var specie = app.collections.species.find({id: speciesID});
                this.model = new morel.Occurrence({
                    attributes: {
                        'taxon': parseInt(specie.attributes.warehouse_id),
                        'adult': 1
                    }
                });

            }
            this.updateInputs();
        },

        updateInputs: function () {
            var that = this,
                $inputs = $('input.stages');
            $inputs.each(function () {
                var name = $(this).attr('name');
                $(this).val(that.model.get(name) || 0);
            });
        },

        appendEventListeners: function () {
            this.appendBackButtonListeners();
        },

        save: function () {
            _log('views.MultiRecordSpeciesPage: saving', log.DEBUG);

            var that = this,
                $inputs = $('input.stages');
            $inputs.each(function () {
                var name = $(this).attr('name');
                var val = parseInt($(this).val());
                if (val || val === 0 && that.model.get(name) !== 0) {
                    that.model.set(name, val);
                }
            });

            if (!this.existingRecord) {
                app.models.sampleMulti.occurrences.add(this.model);
            }

            Backbone.history.history.go(this.existingRecord ? -1 : -2);
        }

    });

    return MultiRecordSpeciesPage;
});

