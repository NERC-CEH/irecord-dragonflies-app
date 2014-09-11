/**
 * Created by darkstar on 16/08/14.
 */
(function($){
    app.filter = app.filter || {};

    app.filter.abundance = {
        filterOn : false,
        ABUNDANCE_DATA : conf_prob_data_src,
        geoloc : null,

        gpsRunning : false,
        loadingData : false,

        LOCATION_GRANULARITY : 2, //Precision of returned grid reference (6 digits = metres).

        /**
         * #0.1 Gets the abundance data from the server.
         */
        loadData : function (){
            if (!this.loadingData){
                this.loadingData = true;
                app.data = app.data || {};//TODO: varInit call

                function onSuccess(json){
                    app.filter.abundance.loadingData = false;
                    app.data.abundance = optimiseData(json);

                    function optimiseData(json){
                        //optimise data
                        var data = {};
                        for (var i = 0; i < json.length; i++){
                            var a = json[i];
                            data[a['l']] = data[a['l']] || {};
                            data[a['l']][a['s']] = a['p'];
                        }
                        return data;
                    }

                    if (app.filter.abundance.filterOn){
                        app.filter.abundance.runFilter();
                    }
                }

                function onError(jqxhr, textStatus, error ) {
                    var err = textStatus + ", " + error;
                    console.log( "Request Failed: " + err );

                    app.filter.abundance.loadingData = false;
                }

                $.ajax({
                    url: this.ABUNDANCE_DATA,
                    dataType: 'jsonp',
                    async: false,
                    success: onSuccess,
                    error: onError
                });
            }
        },


        /**
         * #1 Data loading and GPS locking meeting point.
         */
        runFilter : function(list, onFilterSuccess){
            this.filterOn = true;
            this.list = list || this.list;
            this.onFilterSuccess = onFilterSuccess || this.onFilterSuccess;

            var location = app.settings('location');
            if (location == null){
                $('body').pagecontainer( "change", "sref");
                return;
            }

            app.filter.abundance.sref = getSquare({'lat': location.lat, 'lon': location.lon});

            function getSquare(geoloc){
                //get translated geoloc
                var p = new LatLonE(geoloc.lat, geoloc.lon, GeoParams.datum.OSGB36);
                var grid = OsGridRef.latLonToOsGrid(p);
                var gref = grid.toString(app.filter.abundance.LOCATION_GRANULARITY);
                _log('Using gref: ' + gref);

                //remove the spaces
                return gref.replace(/ /g, '');
            }

            if (app.data.abundance == null) {
                this.loadData();
                return;
            }
            this.onFilterSuccess();
        },


        filterList: function(list){
            var filtered_list  =[];

            var location_data = app.data.abundance[this.sref];
            if(location_data != null){
                var speciesIds = Object.keys(location_data);
                for(var i = 0; i < speciesIds.length; i++){
                    for (var j = 0; j < list.length; j++){
                        if(list[j].id == speciesIds[i]){
                            filtered_list.push(list[j]);
                            break;
                        }
                    }
                }
            }
            return filtered_list;
        },

        sort: function(a, b){
                function getProb(species){
                    var id = species.id;
                    var sref = app.filter.abundance.sref;
                    var data = app.data.abundance;
                    return (data[sref] && data[sref][id]) || 0;
                }
                var a_prob = getProb(a);
                var b_prob = getProb(b);
                if (a_prob == b_prob) return 0;
                return a_prob < b_prob ? 1 : -1;
        }
    };
}(jQuery));
