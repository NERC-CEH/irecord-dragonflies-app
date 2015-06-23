/******************************************************************************
 * Multi Record page view.
 *****************************************************************************/
define([
  'views/_page',
  'views/multiRecordSavedList',
  'templates',
  'morel',
  'conf'
], function(Page, MultiRecordSavedListView) {
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
      this.addList();

      $('body').append($(this.el));

      return this;
    },

    update: function () {

    },

    appendEventListeners: function () {
      this.listenTo(app.models.multiRecord, 'change', this.update);

      this.appendBackButtonListeners();
    },

    addList: function () {
      var multiRecords = app.models.multiRecord.get('records');

      this.listView = new MultiRecordSavedListView({collection: multiRecords});
      this.$list = this.$el.find('#recorded-species-list');
      this.$list.html(this.listView.render().el);

      return this.listView;
    }
  });

  return MultiRecordPage;
});

