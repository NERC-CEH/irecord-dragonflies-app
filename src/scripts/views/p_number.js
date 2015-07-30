/******************************************************************************
 * Number page view.
 *****************************************************************************/
define([
    'views/_page',
    'templates',
    'morel',
    'conf'
], function (DefaultPage) {
    'use strict';

    var Page = DefaultPage.extend({
        id: 'number',

        template: app.templates.p_number,

        events: {
            'change input[type=radio]': 'save'
        },

        initialize: function () {
            _log('views.NumberPage: initialize', log.DEBUG);

            this.model = app.models.sample.occurrences.getFirst();

            this.render();
            this.appendEventListeners();
        },

        render: function () {
            _log('views.NumberPage: render', log.DEBUG);

            this.$el.html(this.template());
            $('body').append($(this.el));

            return this;
        },

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
         * Saves the number to the record.
         *
         * @param e
         * @returns {boolean}
         */
        save: function (e) {
            var value = e.currentTarget.value;
            value = morel.Occurrence.KEYS.NUMBER.values[value];
            if (value !== "") {
                this.model.set(this.id, value);
            }
            window.history.back();
            return false;
        }
    });

    return Page;
});
