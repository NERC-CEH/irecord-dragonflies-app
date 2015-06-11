/******************************************************************************
 * Multi Record page view.
 *****************************************************************************/
define([
  'views/_page',
  'templates',
  'morel',
  'conf'
], function(Page) {
  'use strict';

  var MultiRecordPage = Page.extend({
    id: 'multi-record',

    template: app.templates.multi_record,

    events: {

    },

    initialize: function () {
      _log('views.MultiRecordPage: initialize', log.DEBUG);

      this.render();
      this.appendEventListeners();
    },

    render: function () {
      _log('views.MultiRecordPage: render', log.DEBUG);

      this.$el.html(this.template());
      $('body').append($(this.el));

      return this;
    },


    appendEventListeners: function () {
      this.appendBackButtonListeners();
    }
  });

  return MultiRecordPage;
});

