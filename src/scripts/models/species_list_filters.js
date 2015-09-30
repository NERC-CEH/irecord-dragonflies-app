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
                    run: function (list, filteredList, onSuccess, multi) {
                        var sref = app.models.user.getLocationSref();
                        if (sref == null) {

                            app.models.user.toggleListFilter('probability', 'probabilityGroup', multi);
                            var $button = $('#list-controls-tabs' + (multi ? '-multi' : '')).find('#probability.filter');
                            $button.prop('checked', false).checkboxradio('refresh');

                            var initBtn = "init-button";
                            var initCancelBtnId = "init-cancel-button";

                            var message =
                                '<h2>Location filter</h2>' +

                                '<p>This will filter the species list by your location. ' +
                                'Please set your location for the first time and try the filter again.</p>' +

                                '<fieldset data-role="controlgroup" data-type="horizontal" class="wide">' +
                                '<button id="' + initBtn + '"' +
                                'class="ui-btn ui-btn-inline ui-icon-check ui-btn-icon-left ' +
                                'ui-mini">Set</button>' +

                                '<button id="' + initCancelBtnId + '"' +
                                'class="ui-btn ui-btn-inline ui-icon-delete ui-btn-icon-left ' +
                                'ui-mini">Cancel</button>' +
                                '</fielset>';

                            app.message(message, 0);

                            $('#' + initBtn).on('click', function () {
                                Backbone.history.navigate('location/settings', {trigger:true});
                            });

                            $('#' + initCancelBtnId).on('click', function () {
                                $.mobile.loading('hide');
                            });
                            return;
                        }

                        var location_data = app.data.probability[sref];
                        if (location_data != null) {
                            var speciesIds = Object.keys(location_data);
                            for (var i = 0; i < speciesIds.length; i++) {
                                for (var j = 0; j < list.length; j++) {
                                    if (list[j].id === parseInt(speciesIds[i])) {
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
        },
        colorGroup: {
            type: 'checkbox',
            label: 'Colour',

            filters: {
                yellow: {
                    label: 'Yellow',
                    run: function (list, filteredList, onSuccess) {
                        for (var j = 0; j < list.length; j++) {
                            if (list[j].attributes.colour.yellow) {
                                filteredList.push(list[j]);
                            }
                        }
                        onSuccess(filteredList);
                    }
                },
                green: {
                    label: 'Green',
                    run: function (list, filteredList, onSuccess) {
                        for (var j = 0; j < list.length; j++) {
                            if (list[j].attributes.colour.green) {
                                filteredList.push(list[j]);
                            }
                        }
                        onSuccess(filteredList);
                    }
                },
                blue: {
                    label: 'Blue',
                    run: function (list, filteredList, onSuccess) {
                        for (var j = 0; j < list.length; j++) {
                            if (list[j].attributes.colour.blue) {
                                filteredList.push(list[j]);
                            }
                        }
                        onSuccess(filteredList);
                    }
                },
                orange: {
                    label: 'Red or Orange',
                    run: function (list, filteredList, onSuccess) {
                        for (var j = 0; j < list.length; j++) {
                            if (list[j].attributes.colour.orange) {
                                filteredList.push(list[j]);
                            }
                        }
                        onSuccess(filteredList);
                    }
                },
                grey: {
                    label: 'Grey',
                    run: function (list, filteredList, onSuccess) {
                        for (var j = 0; j < list.length; j++) {
                            if (list[j].attributes.colour.grey) {
                                filteredList.push(list[j]);
                            }
                        }
                        onSuccess(filteredList);
                    }
                },
                brown: {
                    label: 'Brown',
                    run: function (list, filteredList, onSuccess) {
                        for (var j = 0; j < list.length; j++) {
                            if (list[j].attributes.colour.brown) {
                                filteredList.push(list[j]);
                            }
                        }
                        onSuccess(filteredList);
                    }
                }
            }
        }
    };

    return filters;
});
