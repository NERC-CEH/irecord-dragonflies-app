/******************************************************************************
 * Multi Record Info page view.
 *****************************************************************************/
define([
  'views/_page',
  'templates',
  'morel',
  'conf'
], function(Page) {
  'use strict';

  var MultiRecordSpeciesInfo = Page.extend({
    id: 'multi-record-info',

    template: app.templates.multi_record_info,

    events: {

    },

    initialize: function () {
      _log('views.MultiRecordSpeciesInfo: initialize', log.DEBUG);

      this.render();
      this.appendEventListeners();
    },

    render: function () {
      _log('views.MultiRecordSpeciesInfo: render', log.DEBUG);

      this.$el.html(this.template());
      $('body').append($(this.el));

      return this;
    },


    appendEventListeners: function () {
      this.appendBackButtonListeners();
    }
  });

  return MultiRecordSpeciesInfo;
});

