/******************************************************************************
 * Multi Record Species page view.
 *****************************************************************************/
define([
  'views/_page',
  'templates',
  'morel',
  'conf'
], function(Page) {
  'use strict';

  var MultiRecordSpeciesPage = Page.extend({
    id: 'multi-record-species',

    template: app.templates.multi_record_species,

    events: {

    },

    initialize: function () {
      _log('views.MultiRecordSpeciesPage: initialize', log.DEBUG);

      this.render();
      this.appendEventListeners();
    },

    render: function () {
      _log('views.MultiRecordSpeciesPage: render', log.DEBUG);

      this.$el.html(this.template());
      $('body').append($(this.el));

      return this;
    },


    appendEventListeners: function () {
      this.appendBackButtonListeners();
    }
  });

  return MultiRecordSpeciesPage;
});

