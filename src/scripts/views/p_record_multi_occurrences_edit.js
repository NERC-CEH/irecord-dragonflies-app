/******************************************************************************
 * Multi Record Species page view.
 *****************************************************************************/
define([
    'views/_page',
    'templates',
    'morel',
    'conf',
    'helpers/jqm-spinbox'
], function(DefaultPage) {
    'use strict';

    var Page = DefaultPage.extend({
        id: 'record-multi-occurrences-edit',

        template: app.templates.p_record_multi_occurrences_edit,

        events: {
            'click #record-multi-occurrences-edit-save': 'save'
        },

        initialize: function () {
            _log('views.RecordMultiOccurrencesEditPage: initialize', log.DEBUG);

            this.render();
            this.appendEventListeners();
        },

        render: function () {
            _log('views.RecordMultiOccurrencesEditPage: render', log.DEBUG);

            this.$el.html(this.template(this.model));
            $('body').append($(this.el));

            this.$inputsPlaceholder = this.$el.find('#record-multi-occurrences-edit-inputs');

            return this;
        },

        renderInputs: function () {
            var inputs = new InputsView({model: this.model});

            this.$inputsPlaceholder.html(inputs.render().el);
            this.$inputsPlaceholder.trigger('create');
        },

        update: function (occurrenceID, speciesID) {
            _log('views.RecordMultiOccurrencesEditPage: updating', log.DEBUG);

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
            this.renderInputs();
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
            _log('views.RecordMultiOccurrencesEditPage: saving', log.DEBUG);

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

    var InputsView = Backbone.View.extend({
        template: app.templates.record_multi_occurrences_edit_inputs,
        render: function () {
            this.$el.html(this.template(this.model));
            return this;
        }
    });

    return Page;
});

