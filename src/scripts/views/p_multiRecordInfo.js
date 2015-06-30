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

    template: app.templates.p_multi_record_info,

    events: {

    },

    initialize: function () {
      _log('views.MultiRecordSpeciesInfo: initialize', log.DEBUG);
      this.model = app.models.multiRecord;

      this.render();
      this.appendEventListeners();
    },

    render: function () {
      _log('views.MultiRecordSpeciesInfo: render', log.DEBUG);

      this.$el.html(this.template());
      $('body').append($(this.el));

      return this;
    },

    update: function (prevPageId, speciesID) {
      _log('views.MultiRecordSpeciesInfo: update.', log.DEBUG);
      switch (prevPageId) {
        case 'list':
        case 'species':
          this.initRecording(speciesID);
          break;
        case '':
          _log('views.RecordPage: coming from unknown page.', log.WARNING);
          this.initRecording(speciesID);
        default:
      }
    },

    /**
     * Initialises the recording form: sets empty image, clears geolocation etc.
     */
    initRecording: function () {
      this.model.initialize();
    },

    appendEventListeners: function () {
      this.appendBackButtonListeners();
    }
  });

  return MultiRecordSpeciesInfo;
});

