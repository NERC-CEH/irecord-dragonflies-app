/******************************************************************************
 * Stage page view.
 *****************************************************************************/
define([
    'views/_page',
    'templates',
    'morel',
    'conf'
], function (DefaultPage) {
    'use strict';

    var Page = DefaultPage.extend({
        id: 'stage',

        template: app.templates.p_stage,

        events: {
            'change input[type=radio]': 'save'
        },

        initialize: function () {
            _log('views.StagePage: initialize', log.DEBUG);

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
        update: function (model) {
            this.model = model;

            var value = this.model.get(this.id);
            //unset all radio buttons
            this.$el.find("input:radio").attr("checked", false).checkboxradio("refresh");
            if (value) {
                var $input = this.$el.find('input:radio[value="' + value + '"]');
                $input.prop('checked', true).checkboxradio('refresh');
            }
        },

        appendEventListeners: function () {
            this.appendBackButtonListeners();
        },

        /**
         * Saves the stage to the record.
         *
         * @param e
         */
        save: function (e) {
            var value = e.currentTarget.value;
            if (value) {
                this.model.set(this.id, value);
            }
            window.history.back();
        }
    });

    return Page;
});
