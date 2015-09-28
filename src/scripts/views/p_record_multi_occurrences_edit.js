/******************************************************************************
 * Multi-record occurrence edit page view.
 *****************************************************************************/
define([
    'views/_page',
    'templates',
    'morel',
    'conf'
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

        update: function (occurrenceID) {
            _log('views.RecordMultiOccurrencesEditPage: updating', log.DEBUG);

            //needs to go back the history - twice if coming from list
            this.existingRecord = occurrenceID;

            //first time or update if different occurrence or species
            if (!this.model || (occurrenceID && this.model.id !== occurrenceID)){
                this.model = app.models.sampleMulti.occurrences.get(occurrenceID);

                this.renderInputs();
                this.updateInputs();
            }
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

    /**
     * Input buttons
     */
    var InputsView = Backbone.View.extend({
        template: app.templates.record_multi_occurrences_edit_inputs,
        render: function () {
            this.$el.html(this.template(this.model));

            this.$commentButton = this.$el.find('#species-comment-button .descript');
            this.$numberButtons = this.$el.find('.number-button');

            this.model.on('change:adult', this.updateNumberButtons, this);
            this.model.on('change:copulating', this.updateNumberButtons, this);
            this.model.on('change:ovipositing', this.updateNumberButtons, this);
            this.model.on('change:larvae', this.updateNumberButtons, this);
            this.model.on('change:exuviae', this.updateNumberButtons, this);
            this.model.on('change:emergent', this.updateNumberButtons, this);
            this.model.on('change:comment', this.updateCommentButton, this);

            this.updateNumberButtons();
            this.updateCommentButton();
            return this;
        },

        /**
         * Updates the descriptions on the number buttons.
         */
        updateNumberButtons: function () {
            var that = this;
            this.$numberButtons.each(function(){
                var stage = $(this).data('stage'),
                    value = that.model.get(stage);

                $(this).find('.descript').html(value || '');
            });
        },

        /**
         * Updates the button info text.
         */
        updateCommentButton: function () {
            var value = this.model.get('comment');
            var ellipsis = value && value.length > 20 ? '...' : '';
            value = value ? value.substring(0, 20) + ellipsis : ''; //cut it down a bit
            this.$commentButton.html(value);
        }
    });

    return Page;
});

