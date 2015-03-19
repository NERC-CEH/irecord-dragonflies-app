define([
  'backbone',
  'templates'
], function (Backbone) {
  'use strict';

  var SpeciesList = Backbone.View.extend({
    tagName: 'ul',

    attributes: {
      'data-role': 'listview'
    },

    /**
     * A collection of filters used to manage lists.
     * id - filter identifier
     * group - some filters override/work-together. eg. colours, suborder
     * label - label to represent the filter in the UI
     */
    filters: {
      probability: {
        probability:{
          label: 'Probability',
          filter: function (list, onSuccess) {
            var sref = app.models.user.getLocationSref();
            if (sref == null) {
              app.models.user.toggleListFilter('probability');

              Backbone.history.navigate('location', {trigger:true});
              return;
            }

            var filtered_list = [];
              var location_data = app.data.probability[sref];
              if (location_data != null) {
                var speciesIds = Object.keys(location_data);
                for (var i = 0; i < speciesIds.length; i++) {
                  for (var j = 0; j < list.length; j++) {
                    if (list[j].id == speciesIds[i]) {
                      filtered_list.push(list[j]);
                      break;
                    }
                  }
                }
              }
              onSuccess(filtered_list);
          }
      }},
      suborder: {
        anisoptera: {
          label: 'Dragonflies',
          filter: function (list, onSuccess) {
            var filtered_list = [];
            for (var j = 0; j < list.length; j++) {
              if (list[j].attributes.type === 'anisoptera') {
                filtered_list.push(list[j]);
              }
            }
            onSuccess(filtered_list);
          }
        },
        zygoptera: {
          label: 'Damseflies',
          filter: function (list, onSuccess) {
            var filtered_list = [];
            for (var j = 0; j < list.length; j++) {
              if (list[j].attributes.type === 'zygoptera') {
                filtered_list.push(list[j]);
              }
            }
            onSuccess(filtered_list);
          }
        }
      },
      favourites: {
        favourites: {
          filter: function (list, onSuccess) {
            var filtered_list = [];
            var keys = app.models.user.get('favourites');
            for (var i = 0; i < keys.length; i++) {
              for (var j = 0; j < list.length; j++) {
                if (list[j].attributes.id === keys[i]) {
                  filtered_list.push(list[j]);
                }
              }
            }
            onSuccess(filtered_list);
          }
        }}
    },

    DEFAULT_SORT: 'taxonomic',

    /**
     * A collection of sorting options used to manage lists.
     * id - sort type identifier
     * label - label to represent the filter in the UI
     */
    sorts: {
      taxonomic: {
        label: 'Taxonomic',
        sort: function (list, onSuccess) {
          list.sort(function (a, b) {
            a = parseInt(a.attributes.id);
            b = parseInt(b.attributes.id);
            if (a === b) {
              return 0;
            }
            return a > b ? 1 : -1;
          });
          onSuccess(list);
        }
      },
      common_name: {
        label: 'Common Name',
        sort: function (list, onSuccess) {
          list.sort(function (a, b) {
            a = a.attributes.common_name.toLowerCase();
            b = b.attributes.common_name.toLowerCase();
            if (a === b) {
              return 0;
            }
            return a > b ? 1 : -1;
          });
          onSuccess(list);
        }
      },
      common_name_r: {
        label: 'Common Name Reverse',
        sort: function (list, onSuccess) {
          list.sort(function (a, b) {
            a = a.attributes.common_name.toLowerCase();
            b = b.attributes.common_name.toLowerCase();
            if (a === b) {
              return 0;
            }
            return a < b ? 1 : -1;
          });
          onSuccess(list);
        }
      },
      scientific: {
        label: 'Scientific Name',
        sort: function (list, onSuccess) {
          list.sort(function (a, b) {
            a = a.attributes.taxon.toLowerCase();
            b = b.attributes.taxon.toLowerCase();
            if (a === b) {
              return 0;
            }
            return a > b ? 1 : -1;
          });
          onSuccess(list);
        }
      },
      scientific_r: {
        label: 'Scientific Name Reverse',
        sort: function (list, onSuccess) {
          list.sort(function (a, b) {
            a = a.attributes.taxon.toLowerCase();
            b = b.attributes.taxon.toLowerCase();
            if (a === b) {
              return 0;
            }
            return a < b ? 1 : -1;
          });
          onSuccess(list);
        }
      },
      probability_sort: {
        label: 'Probability',
        sort: function (list, onSuccess){
          var sref = app.models.user.getLocationSref();
          if (sref == null) {
            app.models.user.save('sort', 'common_name'); //todo: should be done with error handler
            Backbone.history.navigate('location', {trigger:true});
            return;
          }

          list.sort(function (a, b) {
              var a_prob = getProb(a);
              var b_prob = getProb(b);
              if (a_prob == b_prob) return 0;
              return a_prob < b_prob ? 1 : -1;

              function getProb(species) {
                var id = species.attributes.id;
                var data = app.data.probability;
                return (data[sref] && data[sref][id]) || 0;
              }
            }
         );
          onSuccess(list);
        }
      }
    },

    /**
     *
     */
    initialize: function () {
      _log('views.SpeciesList: initialize', log.DEBUG);

      this.listenTo(this.collection, 'change', this.update);
      this.listenTo(app.models.user, 'change:filters',  this.update);
      this.listenTo(app.models.user, 'change:sort',  this.update);
    },

    /**
     * Renders the species list.
     * @returns {SpeciesListView}
     */
    render: function (onSuccess) {
      _log('views.SpeciesList: render', log.DEBUG);

      var that = this;
      this.prepareList(function (list){
        var container = document.createDocumentFragment(); //optimising the performance
        _.each(list, function (specie) {
          var listSpeciesView = new SpeciesListItemView({model: specie});
          container.appendChild(listSpeciesView.render().el);
        });
        that.$el.html(container); //appends to DOM only once
        if (onSuccess){
          onSuccess(that.$el);
        }
      });
      return this;
    },

    update: function () {
      _log('list: updating', log.INFO);
      this.render(function($el){
        $el.listview('refresh');
      });
    },

    /**
     *
     */
    prepareList: function (callback) {
      var filters = _.clone(app.models.user.get('filters'));
      var sort = app.models.user.get('sort');
      var list = this.collection.models.slice(); //shallow copy of array
      this.prepareListCore(list, sort, filters, callback);
    },

    /**
     *
     * @param list
     * @param sort
     * @param filters
     */
    prepareListCore: function (list, sort, filters, callback) {
      //todo: might need to move UI functionality to higher grounds
      $.mobile.loading("show");

      var that = this;
      //filter list
      var onFilterSuccess = null;
      if (filters.length > 0) {
        var filter = filters.pop();

        onFilterSuccess = function (species) {
          that.prepareListCore(species, sort, filters, callback);
        };

        var group = this.getFilterCurrentGroup(filter);

        this.filters[group][filter].filter(list, onFilterSuccess);
        return;
      }

      function onSortSuccess() {
        //todo: might need to move UI functionality to higher grounds
        $.mobile.loading("hide");
        if (callback) {
          callback(list);
        }
      }

      this.sorts[sort].sort(list, onSortSuccess);
    },

    /**
     * Returns the roup of the filterID.
     *
     * @param filter
     * @returns {Array}
     */
    getFilterCurrentGroup: function (filterID) {
      var group = null;
      //iterate all filter groups
      _.each(this.filters, function (groupFilters, groupID) {
        //and filters
        _.each(groupFilters, function (_filter, _filterID) {
          if(_filterID === filterID) {
            group = groupID;
          }
        });
      });

      return group;
    },

    filterFavourites : function () {
      var filter = app.views.listPage.getFilterById('favourites');
      app.views.listPage.setFilter(filter);
      $("#fav-button").toggleClass("on");

      app.views.listPage.renderList();
    }
  });

  var SpeciesListItemView = Backbone.View.extend({
    tagName: "li",

    attributes: {
      "data-corners": false,
      "data-shadow": false,
      "data-iconshadow": true,
      "data-wrapperels": "div",
      "data-icon": "arrow-r",
      "data-iconpos": "right",
      "data-theme": "c"
    },

    template: app.templates.species_list_item,

    render: function () {
      this.$el.html(this.template(this.model.attributes));
      return this;
    }
  });

  return SpeciesList;
});
