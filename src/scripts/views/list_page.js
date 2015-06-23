/******************************************************************************
 * List page view.
 *****************************************************************************/
define([
  'views/_page',
  'views/list',
  'views/listControls',
  'tripjs',
  'templates'
], function (Page, ListView, ListControlsView) {
  'use strict';

  var ListPage = Page.extend({
    id: 'list',

    template: app.templates.list,

    events: {
      'click #list-controls-save-button': 'toggleListControls',
      'click #list-controls-button': 'toggleListControls',
      'change input[type=radio]': 'toggleListControls'
    },

    initialize: function () {
      _log('views.ListPage: initialize', log.DEBUG);

      this.$listControlsButton = this.$el.find('#list-controls-button');
      this.listControlsView = new ListControlsView(this.$listControlsButton);

      this.render();
      this.appendEventListeners();

      this.$userPageButton = $('#user-page-button');

      this.trip();
    },

    render: function () {
      _log('views.ListPage: render', log.DEBUG);

      this.$el.html(this.template());
      this.addList();

      $('body').append($(this.el));

      //add list controls
      var $listControls = this.$el.find('#list-controls-placeholder');
      $listControls.html(this.listControlsView.el);

      return this;
    },

    addList: function () {
      this.listView = new ListView({collection: app.collections.species});
      this.$list = this.$el.find('#list-placeholder');
      this.$list.html(this.listView.render().el);
      return this.listView;
    },

    update: function () {
      this.listControlsView.updateListControlsButton();
      this.updateUserPageButton();
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
    },

    /**
     * Updates the user page navigation button with the state of saved records.
     * Todo: hook into some record counter event
     */
    updateUserPageButton: function () {
      var $userPageButton = this.$userPageButton;
      function onSuccess(savedRecords) {
        var savedRecordIDs = Object.keys(savedRecords);
        $userPageButton.toggleClass('running', savedRecordIDs.length > 0);

      }
      morel.record.db.getAll(onSuccess);
    },

    /**
     * Shows the user around the page.
     */
    trip: function () {
      var finishedTrips = app.models.user.get('trips') || [];
      if (finishedTrips.indexOf('list') < 0) {
        finishedTrips.push('list');
        app.models.user.set('trips', finishedTrips);
        app.models.user.save();

        setTimeout(function(){
          trip.start();
        }, 500);
      }

      var options = {
        delay : 1500
      };

      var trip = new Trip([
        {
          sel : $('#user-page-button'),
          position : "s",
          content : 'Your Account',
          animation: 'fadeIn'
        },
        {
          sel : $('#fav-button'),
          position : "s",
          content : 'List Controls',
          animation: 'fadeIn'
        },
        {
          sel : $('a[href="#species/10"]'),
          position : "s",
          content : 'Species Account',
          animation: 'fadeIn'
        },
        {
          sel : $('a[href="#record/88"]'),
          position : "w",
          content : 'Recording',
          animation: 'fadeIn'
        }
      ], options);
    }
  });

  return ListPage;
});
