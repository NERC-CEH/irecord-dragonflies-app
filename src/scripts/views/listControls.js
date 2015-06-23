/******************************************************************************
 * Species list control view used in ListPage view.
 *****************************************************************************/
define([
  'backbone',
  'models/speciesListSorts',
  'models/speciesListFilters',
  'templates'
], function (Backbone, sorts, filters) {
  'use strict';

  var SpeciesListControlsView = Backbone.View.extend({
    tagName: 'div',
    id: 'list-controls-tabs',

    template: app.templates.list_controls,
    template_sort: app.templates.list_controls_sort,
    template_filter: app.templates.list_controls_filter,

    initialize: function ($listControlsButton) {
      this.$listControlsButton = $listControlsButton;
      this.render();
    },

    render: function () {
      this.$el.html(this.template());

      this.renderListSortControls();
      this.renderListFilterControls();
      this.setListControlsListeners();
    },

    attributes: function () {
      return {
        "data-role": 'tabs'
      };
    },

    /**
     * Shows/closes list controlls.
     */
    toggleListControls: function (e) {
      if (this.$el.is(":hidden")) {
        this.$el.slideDown("slow");
      } else {
        this.$el.slideUp("slow");
      }
    },


    /**
     * Renders and appends the list sort controls.
     */
    renderListSortControls: function () {
      var keys = Object.keys(sorts);
      for (var i = 0, length = keys.length; i < length; i++) {
        var sort = app.models.user.get('sort');

        if (keys[i] === sort) {
          sorts[keys[i]].checked = "checked";
        }
      }

      var placeholder = this.$el.find('#list-controls-sort-placeholder');

      placeholder.html(this.template_sort(sorts));
      placeholder.trigger('create');
    },

    /**
     * Renders and appends the list filter controls.
     */
    renderListFilterControls: function () {
      var currentFilters = app.models.user.get('filters');

      _.each(filters, function (filterGroup, filterGroupID) {
        _.each(filterGroup.filters, function (filter, filterID) {
          if (currentFilters[filterGroupID] && currentFilters[filterGroupID].indexOf(filterID) >= 0) {
            filter.checked = "checked";
          } else {
            filter.checked = "";
          }
        });
      });

      var placeholder = this.$el.find('#list-controls-filter-placeholder');

      placeholder.html(this.template_filter(filters));
      placeholder.trigger('create');
    },

    /**
     * Has to be done once on list creation.
     */
    setListControlsListeners: function () {
      //initial list control button setup
      this.updateListControlsButton();

      this.$el.find('.sort').on('change', function () {
        app.models.user.save('sort', this.id);
      });

      var that = this;
      this.$el.find('.filter').on('change', function (e) {
        app.models.user.toggleListFilter(this.id, $(this).data('group'));
        that.updateListControlsButton();
      });
    },

    /**
     * Updates the list controls button with the current state of the filtering.
     * If one or more filters is turned on then the button is
     * coloured accordingly.
     */
    updateListControlsButton: function () {
      var filters = app.models.user.get('filters');
      var activate = false;
      _.each(filters, function (filterGroup, filterGroupID){
        if (filterGroup.length > 0) {
          activate = true;
        }
      });

      $(this.$listControlsButton.selector).toggleClass('running', activate);
    }
  });

  return SpeciesListControlsView;
});
