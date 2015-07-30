/******************************************************************************
 * List page view.
 *****************************************************************************/
define([
  'views/_page',
  'views/record_multi_list',
  'views/list_controls',
  'templates'
], function (DefaultPage, ListView, ListControlsView) {
  'use strict';

  var Page = DefaultPage.extend({
    id: 'record-multi-list',

    template: app.templates.p_record_multi_list,

    events: {
      'click #list-controls-save-button': 'toggleListControls',
      'click #list-controls-button': 'toggleListControls',
      'change input[type=radio]': 'toggleListControls'
    },

    initialize: function () {
      _log('views.RecordMultiListPage: initialize', log.DEBUG);

      this.$listControlsButton = this.$el.find('#list-controls-button');

      //todo: enable list controls
      //this.listControlsView = new ListControlsView(this.$listControlsButton);
      this.listControlsView = new (Backbone.View.extend({
        toggleListControls: function () {
          app.message('<center><b>Disabled</b></center>', 500);
        },
        updateListControlsButton: function (){}
      }))();

      this.render();
      this.appendEventListeners();

      this.$userPageButton = $('#user-page-button');
    },

    render: function () {
      _log('views.RecordMultiListPage: render', log.DEBUG);

      this.$el.html(this.template());
      this.addList();

      $('body').append($(this.el));

      //add list controls
      var $listControls = this.$el.find('#list-controls-placeholder');
      $listControls.html(this.listControlsView.el);

      return this;
    },

    addList: function () {
      this.listView = new ListView({
        collection: app.collections.species,
        record: true
      });
      this.$list = this.$el.find('#record-multi-list-placeholder');
      this.$list.html(this.listView.render().el);
      return this.listView;
    },

    update: function () {
      this.listControlsView.updateListControlsButton();
    },

    appendEventListeners: function () {
      this.listenTo(app.models.user, 'change:filters', this.listControlsView.updateListControlsButton);

      $('.record-multi-list-img').on('click', function (e) {
        //stop propagation of jqm link
        e.stopPropagation();
        e.preventDefault();

        var id = $(this).data('id');
        Backbone.history.navigate('species/' + id, {trigger: true});
      });

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
