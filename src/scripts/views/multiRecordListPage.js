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

  var MultiRecordListPage = Page.extend({
    id: 'multi-record-list',

    template: app.templates.multi_record_list,

    events: {

    },

    initialize: function () {
      _log('views.MultiRecordListPage: initialize', log.DEBUG);

      this.render();
      this.appendEventListeners();
    },

    render: function () {
      _log('views.MultiRecordListPage: render', log.DEBUG);

      this.$el.html(this.template());
      $('body').append($(this.el));

      return this;
    },


    appendEventListeners: function () {
      this.appendBackButtonListeners();
    }
  });

  return MultiRecordListPage;
});

