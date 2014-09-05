/**
 *
 */

(function($){
    app.controller = app.controller || {};
    app.controller.list = {
        DEFAULT_SORT : 'common_name',
        FILTERS_KEY : 'listFilters',
        SORT_KEY : 'listSort',

        /**
         * An array of filters used to manage lists.
         * id - filter identifier
         * group - some filters override/work-together. eg. colours, suborder
         * label - label to represent the filter in the UI
         */
        filters : [
            {
                'id' : 'zygoptera',
                'group' : 'suborder',
                'label' : 'Damselflies'
            },
            {
                'id' : 'anisoptera',
                'group' : 'suborder',
                'label' : 'Dragonflies'
            },
            {
                'id' : 'abundance',
                'group' : 'abundance',
                'label': 'Abundance'
            },
            {
                'id' : 'favourites',
                'group' : 'favourites'
            }
        ],

        /**
         * An array of sorting options used to manage lists.
         * id - sort type identifier
         * label - label to represent the filter in the UI
         */
        sorts : [
            {
                'id' : 'common_name',
                'label' : 'Common Name'
            },
            {
                'id' : 'common_name_r',
                'label' : 'Common Name Reverse'
            },
            {
                'id' : 'taxonomic',
                'label' : 'Taxonomic'
            },
            {
                'id' : 'taxonomic_r',
                'label' : 'Taxonomic Reverse'
            },
            {
                'id' : 'abundance_sort',
                'label' : 'Abundance'
            }
        ],

        /**
         *
         */
        pagecreate : function(){
            _log('List init');

            //load species data
            $.ajax({
                url: Drupal.settings.basePath + "serv/species",
                dataType: 'json',
                async: false,
                success: function (species){
                    var data = varInit('app.data');
                    data['species'] = species;
                    //todo: what if data comes first before pagecontainershow
                    app.controller.list.renderList();
                    /**
                     * Prints species data for probability table mapping
                     */
//                      var text = '';
//                      for(var i=0; i < species.length; i++){
//                          text += "\n" + species[i].taxon + ', ' + species[i].id + ', ' +  species[i].warehouse_id;
//                      }
//                      console.log(text);
                }
            });

            app.controller.list.makeListControls();
            app.filter.abundance.loadData();
        },

        /**
         *
         */
        pagecontainershow: function(){
            _log('Beforeshow list');
            this.renderList();
        },

        /**
         *
         */
        renderList : function(){
            var filters = this.getCurrentFilters();
            var sort = this.getSortType();
            var species = app.data.species;
            if (species != null){
                this.renderListCore(species, sort, filters);
            }
        },

        /**
         *
         * @param list
         * @param sort
         * @param filters
         */
        renderListCore: function(list, sort, filters){
            //filter list
            if(filters.length > 0){
                var filter = filters.pop();

                list = this.filterList(list, filter, onFilterSuccess);
                function onFilterSuccess (species){
                    app.controller.list.renderListCore(species, sort, filters);
                }

                return;
            }

            list = this.sortList(list, sort, onSortSuccess);
            function onSortSuccess(){
                if (list != null){
                    app.controller.list.printList(list);
                }
            }
        },

        /**
         *
         * @param species
         */
        printList : function(species){
            //assign favourites
            var s = objClone(species);

            var favourites = this.getFavourites();
            var keys = Object.keys(favourites);
            for(var i = 0; i < keys.length; i++){
                for(var j = 0; j < s.length; j++){
                    if (keys[i] == s[j].id){
                        s[j].favourite = "favourite";
                    }
                }
            }

            var template = $('#list-template').html();
            var placeholder = $('#list-placeholder');

            var compiled_template = Handlebars.compile(template);

            placeholder.html(compiled_template({'species': s}));
            placeholder.trigger('create');
        },

        /**
         *
         */
        makeListControls : function(){
            this.makeListSortControls();
            this.makeListFilterControls();
        },

        /**
         *
         */
        makeListSortControls : function(){
            for(var i = 0; i < this.sorts.length; i++){
                var sort = this.getSortType();
                if(this.sorts[i].id == sort){
                    this.sorts[i]['checked'] = "checked";
                }
            }

            var template = $('#list-controls-sort-template').html();
            var placeholder = $('#list-controls-sort-placeholder');

            var compiled_template = Handlebars.compile(template);

            placeholder.html(compiled_template(this.sorts));
            placeholder.trigger('create');
        },

        /**
         *
         */
        makeListFilterControls : function(){
            var filtersToRender = [];
            var currentFilters = this.getCurrentFilters();

            for(var i = 0; i < this.filters.length; i++){
                //only render those that have label
                if(this.filters[i].label != null){
                    for(var j = 0; j < currentFilters.length; j++){
                        if(currentFilters[j].id == this.filters[i].id){
                            this.filters[i]['checked'] = "checked";
                        }
                    }
                    filtersToRender.push(this.filters[i]);
                }
            }

            var template = $('#list-controls-filter-template').html();
            var placeholder = $('#list-controls-filter-placeholder');

            var compiled_template = Handlebars.compile(template);

            placeholder.html(compiled_template(filtersToRender));
            placeholder.trigger('create');
        },

        /**
         *
         * @returns {*|Object|{}}
         */
        getSpecies : function(){
            return app.settings('listSpecies') || {};
        },

        setSpecies : function(species){
            return app.settings('listSpecies', species);
        },

        /**
         * Uses session storage;
         * @returns {*|{}}
         */
        CURRENT_SPECIES_KEY: 'currentSpecies',
        getCurrentSpecies: function(){
            return app.storage.tmpGet(this.CURRENT_SPECIES_KEY);
        },

        /**
         *
         * @param id
         * @returns {*}
         */
        setCurrentSpecies : function(id){
            var species = {};

            for (var i = 0; i < app.data.species.length; i++) {
                if (app.data.species[i].id == id) {
                    species = app.data.species[i];
                    break;
                }
            }
            return app.storage.tmpSet(this.CURRENT_SPECIES_KEY, species);
        },

        /**
         *
         * @returns {*|Object|Array}
         */
        getCurrentFilters : function(){
            return app.settings(this.FILTERS_KEY) || [];
        },

        /**
         *
         * @param filter
         * @returns {Array}
         */
        getFilterCurrentGroup : function(filter){
            var current_filter = this.getCurrentFilters();
            var grouped = [];
            for (var i =0; i < current_filter.length; i++){
                if (current_filter[i].group == filter.group){
                    grouped.push(current_filter[i]);
                }
            }
            return grouped;
        },

        /**
         *
         * @returns {*|Object|string}
         */
        getSortType : function(){
            return app.settings(this.SORT_KEY) || this.DEFAULT_SORT;
        },

        /**
         *
         * @param type
         * @returns {*|Object}
         */
        setSortType : function(type){
            return app.settings(this.SORT_KEY, type);
        },

        /**
         *
         * @param id
         * @returns {*}
         */
        getFilterById : function(id){
            for(var i = 0; i < this.filters.length; i++){
                if(this.filters[i].id == id){
                    return this.filters[i];
                }
            }
            return null;
        },

        /**
         *
         * @param filter
         */
        setFilter : function(filter){
            var filters = this.getCurrentFilters();

            for(var i = 0; i < filters.length; i++){
                if(filters[i].id == filter.id){
                    this.removeFilter(filter);
                    return;
                }
            }
            filters.push(filter);
            app.settings(this.FILTERS_KEY, filters);
        },

        /**
         *
         * @param filter
         */
        removeFilter : function(filter){
            var filters = this.getCurrentFilters();
            var index = -1;
            for(var i=0; i < filters.length; i++){
                if(filters[i].id == filter.id){
                    index = i;
                }
            }

            if (index != -1){
                filters.splice(index, 1);
                app.settings(this.FILTERS_KEY, filters);
            }
        },

        /**
         *
         * @param id
         * @param favourite
         */
        changeFavourite : function(id, favourite){
            var species = this.getSpecies();
            if(species[id] == null){
                species[id] = {'favourite' : favourite };
            } else {
                species[id].favourite = favourite ;
            }
            this.setSpecies(species);
        },

        /**
         *
         * @returns {{}}
         */
        getFavourites : function(){
            var species =  this.getSpecies();
            var favourites = {};

            var keys = Object.keys(species);
            for(var i=0; i < keys.length; i++){
                var specie = species[keys[i]];
                if(specie.favourite != null && specie.favourite == true){
                    favourites[keys[i]] =species[keys[i]];
                }
            }
            return favourites;
        },

        /**
         *
         * @param list
         * @param filter
         * @param onSuccess
         */
        filterList: function (list, filter, onSuccess){
            var filtered_list = [];
            var grouped = this.getFilterCurrentGroup(filter);

            switch(filter.group){
                case 'favourites':
                    var keys = Object.keys(this.getFavourites());
                    for(var i = 0; i < keys.length; i++){
                        for(var j = 0; j < list.length; j++){
                            if(list[j].id == keys[i]){
                                filtered_list.push(list[j]);
                            }
                        }
                    }
                    break;
                case 'suborder':
                    for(var j = 0; j < list.length; j++){
                        for( var k = 0; k < grouped.length; k++){
                            if(grouped[k].id == list[j].type){
                                filtered_list.push(list[j]);
                            }
                        }
                    }
                    break;
                case 'abundance':
                    app.filter.abundance.runFilter(list, function(){
                        filtered_list = app.filter.abundance.filterList(list);
                        onSuccess(filtered_list);
                    });
                    return;
                    break;
                default:
                    _log('Error: Unknown list filter.');
            }
            onSuccess(filtered_list);
        },

        /**
         *
         * @param list
         * @param sort
         * @param onSuccess
         */
        sortList: function (list, sort, onSuccess){
            switch(sort){
                case 'abundance_sort':
                    app.filter.abundance.runFilter(list, function(){
                        list.sort(app.filter.abundance.sort);
                        onSuccess(list);
                        return;
                    });
                    break;
                case 'taxonomic':
                    list.sort(function(a, b){
                        a = a['taxon'].toLowerCase();
                        b = b['taxon'].toLowerCase();
                        if (a == b){
                            return 0;
                        }
                        return a > b ? 1 : -1;
                    });
                    break;
                case 'taxonomic_r':
                    list.sort(function(a, b){
                        a = a['taxon'].toLowerCase();
                        b = b['taxon'].toLowerCase();
                        if (a == b){
                            return 0;
                        }
                        return a < b ? 1 : -1;
                    });
                    break;
                case this.DEFAULT_SORT + '_r':
                    list.sort(function(a, b){
                        a = a['common_name'].toLowerCase();
                        b = b['common_name'].toLowerCase();
                        if (a == b){
                            return 0;
                        }
                        return a < b ? 1 : -1;
                    });
                    break;
                case this.DEFAULT_SORT:
                default:
                    list.sort(function(a, b){
                        a = a['common_name'].toLowerCase();
                        b = b['common_name'].toLowerCase();
                        if (a == b){
                            return 0;
                        }
                        return a > b ? 1 : -1;
                    });
            }
            onSuccess(list);
        }
    };

    /**
     *
     */
    $(document).ready(function() {
        $('.sort').on('change', function() {
            app.controller.list.setSortType(this.id);
            app.controller.list.renderList();
        });

        $('.filter').on('change', function() {
            var filter = app.controller.list.getFilterById(this.id);
            app.controller.list.setFilter(filter);
            app.controller.list.renderList();
        });
    });

    app.navigation.showListControls = function(){
        $('#list-controls-placeholder').slideToggle('slow');
    };

    app.navigation.filterFavourites = function(){
        var filter = app.controller.list.getFilterById('favourites');
        app.controller.list.setFilter(filter);
        app.controller.list.renderList();
    };

}(jQuery));

