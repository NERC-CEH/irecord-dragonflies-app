/******************************************************************************
 * Multi Record Species page view.
 *****************************************************************************/
define([
  'views/_page',
  'templates',
  'morel',
  'conf',
  'helpers/jqm-spinbox'
], function(Page) {
  'use strict';

  var MultiRecordSpeciesPage = Page.extend({
    id: 'multi-record-species',

    template: app.templates.multi_record_species,

    events: {
    'click #multi-record-species-save': 'save'
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

    update: function (id) {
      _log('views.MultiRecordSpeciesPage: updating', log.DEBUG);
      this.model = app.models.multiRecord.setRecordSpeciesID(id);

      this.updateInputs();
    },

    updateInputs: function () {
      var stages = this.model.get('stages');
      var $inputs = $('input.stages');
      $inputs.each(function () {
        var name = $(this).attr('name');
        $(this).val(stages[name] || 0);
      });
    },

    appendEventListeners: function () {
      this.appendBackButtonListeners();
    },

    save: function () {
      _log('views.MultiRecordSpeciesPage: saving', log.DEBUG);
      var stages = {};

      var $inputs = $('input.stages');
      $inputs.each(function () {
        var val = $(this).val();
        var name = $(this).attr('name');

        stages[name] = parseInt(val);
      });
      this.model.set('stages', stages);
      //todo: needs to go back the history - twice if comming from list
      Backbone.history.navigate('multi-record', {trigger: true});
    }

  });

  return MultiRecordSpeciesPage;
});

