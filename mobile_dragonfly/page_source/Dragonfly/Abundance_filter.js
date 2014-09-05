/**
 * Created by darkstar on 16/08/14.
 */
(function($){

    app.router = new jQuery.mobile.Router([
        { "#list": { events: "i", handler: onPageInit } }
    ]);

    /**
     * #0. Executes on a page listing the species load
     */
    function onPageInit(){
        app.filter.abundance.loadData();
    }

    app.filter = app.filter || {};

    app.filter.abundance = {
        filterOn : false,
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
                app.data.abundance = {};//TODO: varInit call

                function onSuccess(json){
                    app.filter.abundance.loadingData = false;
                    app.data.abundance = json;

                    //if took long time to fetch data and GPS loc is on - continue with filter
                    if (this.filterOn){
                        this.runFilter();
                    }
                }

                function onError(jqxhr, textStatus, error ) {
                    var err = textStatus + ", " + error;
                    console.log( "Request Failed: " + err );

                    app.filter.abundance.loadingData = false;
                }

                $.getJSON("//localhost/main/Dragonfly/abundance.json").done(onSuccess).fail(onError);
            }
        },


        /**
         * #1 Data loading and GPS locking meeting point.
         */
        runFilter : function(){
            this.filterOn = true;
            if (this.geoloc == null){
                this.getGPS();
                return;
            } else if (app.data.abundance == null) {
                this.loadData();
                return;
            }
            this.prepareList();
        },


        /**
         * #1.1
         */
        getGPS : function (){
            if (!this.gpsRunning){
                this.gpsRunning = true;
                this.geoloc = {};
                onSuccess();
                function onSuccess(){
                    app.filter.abundance.geoloc = {'lat':51.773153, 'lon':-1.338912};
                    app.filter.abundance.running = false;
                    app.filter.abundance.runFilter();
                }

                function onError(){
                    app.filter.abundance.gpsRunning = false;
                }
            }
        },

        /**
         * #2
         */
        prepareList : function (){
            //optimise data
            if (app.data.abundance instanceof Array){
                var data = {};
                for (var i = 0; i < app.data.abundance.length; i++){
                    var a = app.data.abundance[i];
                    data[a['l']] = data[a['l']] || {};
                    data[a['l']][a['s']] = a['p'];
                }
                app.data.abundance = data;
            }

            //find which current location gref square
            var location = this.getSquare(this.geoloc);

            //sort and filter the species array
            var a_mod_species  =[];

            //filter species
            if(app.data.abundance[location] != null){
                var keys = Object.keys();
                for(var i = 0; i < keys.length; i++){
                    for (var j = 0; j < app.data.species.length; j++){
                        if(app.data.species[j].id == keys[i]){
                            a_mod_species.push(app.data.species[j]);
                            break;
                        }
                    }
                }

                //sort species
                this.sortList(a_mod_species, function(a, b){
                    function getProb(species){
                        var id = species.id;
                        return app.data.abundance[location][id];
                    }
                    return getProb(a) < getProb(b);
                });
            }

            // redisplay
            this.printList(a_mod_species);
        },

        printList : function (list){
            console.log(list)
        },

        sortList : function (a_list, sortFunc){
            a_list.sort(sortFunc);
        },

        getSquare : function (geoloc){
            //get translated geoloc
            var p = new LatLonE(geoloc.lat, geoloc.lon, GeoParams.datum.OSGB36);
            var grid = OsGridRef.latLonToOsGrid(p);

            return grid.toString(this.LOCATION_GRANULARITY).replace(" ", "");
        }


    };
}(jQuery));
