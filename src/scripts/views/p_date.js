/******************************************************************************
 * Date page view.
 *****************************************************************************/
define([
  'views/_page',
  'templates',
  'morel',
  'conf'
], function (Page) {
  'use strict';

  var DatePage = Page.extend({
    id: 'date',

    warehouse_id: morel.record.inputs.KEYS.DATE,

    template: app.templates.p_date,

    events: {
      'click #date-save': 'save'
    },

    initialize: function () {
      _log('views.DatePage: initialize', log.DEBUG);

      this.render();

      this.$input = $('#record-date');

      this.appendEventListeners();
    },

    appendEventListeners: function () {
      this.appendBackButtonListeners();
    },

    render: function () {
      this.$el.html(this.template());

      $('body').append($(this.el));
      return this;
    },

    /**
     * Saves the date to the record.
     */
    save: function () {
      var value = this.$input.val();
      if (value !== "") {
        this.model.set(this.warehouse_id, value);
      }
      window.history.back();
    }
  });

  return DatePage;
});
