/******************************************************************************
 * List page view.
 *****************************************************************************/
define([
  'views/_page',
  'views/speciesList',
  'views/speciesListControls',
  'templates'
], function (Page, SpeciesListView, SpeciesListControlsView) {
  'use strict';

  var Page = Page.extend({
    id: 'multi-record-list',

    template: app.templates.multi_record_list,

    events: {
      'click #list-controls-save-button': 'toggleListControls',
      'click #list-controls-button': 'toggleListControls',
      'change input[type=radio]': 'toggleListControls'
    },

    initialize: function () {
      _log('views.MultiRecordListPage: initialize', log.DEBUG);

      this.$listControlsButton = this.$el.find('#list-controls-button');
      this.listControlsView = new SpeciesListControlsView(this.$listControlsButton);

      this.render();
      this.appendEventListeners();

      this.$userPageButton = $('#user-page-button');
    },

    render: function () {
      _log('views.MultiRecordListPage: render', log.DEBUG);

      this.$el.html(this.template());
      this.addList();

      $('body').append($(this.el));

      //add list controls
      var $listControls = $('#list-controls-placeholder');
      $listControls.html(this.listControlsView.el);

      return this;
    },

    addList: function () {
      this.listView = new SpeciesListView({
        collection: app.collections.species,
        record: true
      });
      this.$list = this.$el.find('#list-placeholder');
      this.$list.html(this.listView.render().el);
      return this.listView;
    },

    update: function () {
      this.listControlsView.updateListControlsButton();
    },

    appendEventListeners: function () {
      this.listenTo(app.models.user, 'change:filters', this.listControlsView.updateListControlsButton);

      this.appendBackButtonListeners();
    },

    /**
     * Shows/hides the list controls.
     */
    toggleListControls: function () {
      this.listControlsView.toggleListControls();
    }
  });

  return Page;
});
