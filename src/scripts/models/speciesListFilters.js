/******************************************************************************
 * Species list filters.
 *****************************************************************************/
define([], function () {
  /**
   * A collection of filters used to manage lists.
   * id - filter identifier
   * group - some filters override/work-together. eg. colours, suborder
   * label - label to represent the filter in the UI
   */
  var filters =  {
    favouritesGroup: {
      type: 'checkbox',
        label: 'Favourites',
        filters: {
        favourites: {
          label: 'My favourites only',
            run: function (list, filteredList, onSuccess) {
            var keys = app.models.user.get('favourites');
            for (var i = 0; i < keys.length; i++) {
              for (var j = 0; j < list.length; j++) {
                if (list[j].attributes.id === keys[i]) {
                  filteredList.push(list[j]);
                }
              }
            }
            onSuccess(filteredList);
          }
        }
      }
    },
    typeGroup: {
      type: 'checkbox',
        label: 'Type',

        filters: {
        grass: {
          label: 'Dragonflies',
            run: function (list, filteredList, onSuccess) {
            for (var j = 0; j < list.length; j++) {
              if (list[j].attributes.type === 'anisoptera' || list[j].attributes.general) {
                filteredList.push(list[j]);
              }
            }
            onSuccess(filteredList);
          }
        },
        flower: {
          label: 'Damselflies',
            run: function (list, filteredList, onSuccess) {
            for (var j = 0; j < list.length; j++) {
              if (list[j].attributes.type === 'zygoptera' || list[j].attributes.general) {
                filteredList.push(list[j]);
              }
            }
            onSuccess(filteredList);
          }
        }
      }
    },
    probabilityGroup: {
      type: 'checkbox',
        label: 'Location',
        filters: {
        probability: {
          label: 'Species in your location',
            run: function (list, filteredList, onSuccess) {
            var sref = app.models.user.getLocationSref();
            if (sref == null) {

              var initBtn = "init-button";
              var initCancelBtnId = "init-cancel-button";

              var message =
                '<h3>Please set your location first.</h3></br>' +

                '<button id="' + initBtn + '" class="ui-btn">Set Location</button>' +
                '<button id="' + initCancelBtnId + '" class="ui-btn">Cancel</button>';

              app.message(message, 0);

              $('#' + initBtn).on('click', function () {
                $('#probability.filter').prop('checked', false).checkboxradio('refresh');
                app.models.user.toggleListFilter('probability');
                Backbone.history.navigate('location', {trigger:true});
              });

              $('#' + initCancelBtnId).on('click', function () {
                $.mobile.loading('hide');
                app.models.user.toggleListFilter('probability');
                $('#probability.filter').prop('checked', false).checkboxradio('refresh');
              });
              return;
            }

            var location_data = app.data.probability[sref];
            if (location_data != null) {
              var speciesIds = Object.keys(location_data);
              for (var i = 0; i < speciesIds.length; i++) {
                for (var j = 0; j < list.length; j++) {
                  if (list[j].id === speciesIds[i]) {
                    filteredList.push(list[j]);
                    break;
                  }
                }
              }
            }
            //add general ones
            //  var general = _.findWhere(list, {attributes:{general: "TRUE"}});
            // filtered_list.push(general);

            onSuccess(filteredList);
          }
        }
      }
    }
  };

  return filters;
});
