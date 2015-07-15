/******************************************************************************
 * Stage page view.
 *****************************************************************************/
define([
    'views/_page',
    'templates',
    'morel',
    'conf'
], function (Page) {
    'use strict';

    var StagePage = Page.extend({
        id: 'stage',

        template: app.templates.p_stage,

        events: {
            'change input[type=radio]': 'save'
        },

        initialize: function () {
            _log('views.StagePage: initialize', log.DEBUG);

            this.model = app.models.sample.occurrences.getFirst();

            this.render();
            this.appendEventListeners();
        },

        render: function () {
            _log('views.StagePage: render', log.DEBUG);

            this.$el.html(this.template());
            $('body').append($(this.el));

            return this;
        },

        /**
         * Reset the page.
         */
        update: function () {
            var value = this.model.get(this.id);
            if (!value) {
                //unset all radio buttons
                this.$el.find("input:radio").attr("checked", false).checkboxradio("refresh");
            }
        },

        appendEventListeners: function () {
            this.listenTo(this.model, 'change:' + this.id, this.update);

            this.appendBackButtonListeners();
        },

        /**
         * Saves the stage to the record.
         *
         * @param e
         */
        save: function (e) {
            var value = e.currentTarget.value;
            value = morel.Occurrence.KEYS.STAGE.values[value];
            if (value) {
                this.model.set(this.id, value);
            }
            window.history.back();
        }
    });

    return StagePage;
});
