/**
 * Created by karkaz on 20/08/14.
 */
(function($){
    app.controller = app.controller || {};
    app.controller.sref = {
        saveData: false,

        pagecreate : function(){
            _log('sref: pagecreate.');

            if (typeof google == 'undefined'){
                $('#sref-opts').disableTab(1);

                /*
                 If the browser is offline then we should not proceed and so the
                 dummyText controls the caching of the file - always get fresh
                 */
                var dummyText = '&' + (new Date).getTime();
                loadScript('http://maps.googleapis.com/maps/api/js?sensor=false&' +
                'callback=app.controller.sref.initializeMap' +
                dummyText
                );
            }
        },

        pagecontainerbeforeshow: function(e, data){
            this.saveData = false; //reset
        },

        pagecontainerbeforechange: function(e, data){
            _log('sref: pagecontainerbeforechange.');
            if (typeof data.toPage === 'object' && data.toPage[0] != null){
                nextPage = data.toPage[0].id;

                if (this.saveData && this.accuracy != -1){
                    //Save button
                    switch (nextPage) {
                        case 'record':
                            var location = this.saveSref();
                            app.controller.record.saveSref(location);
                            break;
                        case 'settings':
                            this.saveSref();
                            break;
                        case 'list':
                            this.saveSref();
                            app.controller.list.prob.runFilter();
                            break;
                        default:
                            _log('sref: ERROR changing to unknown page.')
                    }
                } else {
                    //Cancel button
                    switch (nextPage) {
                        case 'list':
                            //the filter needs to be removed if canceled
                            // at the location stage
                            var filter = {'id': 'probability'};
                            app.controller.list.removeFilter(filter);
                            break;
                        default:
                            _log('sref: ERROR changing to unknown page.')
                    }
                }
            }
        },

        saveSref: function(){
            //save in storage
            var location = {
                'lat' : this.latitude,
                'lon' : this.longitude,
                'acc' : this.accuracy
            };
            app.settings('location', location);
            app.geoloc.set(location.lat, location.lon, location.acc);
            return location;
        },

        /**
         * Should be overwritten by page-specific saving procedure
         */
        save : function(){
            _log('sref: saving Sref.');
            this.saveData = true;
        },

        map : {},
        latitude : null,
        longitude : null,
        accuracy : -1,

        set : function(lat, lon, acc){
            this.latitude = lat;
            this.longitude = lon;
            this.accuracy = acc;
         },

        get : function(){
            return {
                'lat' : this.latitude,
                'lon' : this.longitude,
                'acc' : this.accuracy
            }
        },

        updateCoordinateDisplay : function(lat, lon, acc){
            var info = 'Your coordinates: ' +  lat + ', ' + lon + ' (Accuracy: ' + acc + ')';
            $('#coordinates').text(info);
        },

        /**
         * Mapping
         */
        initializeMap : function() {
            _log("sref: initialising map.");
            //todo: add checking
            var mapCanvas = $('#map-canvas')[0];
            var mapOptions = {
                zoom: 5,
                center: new google.maps.LatLng(57.686988, -14.763319),
                zoomControl: true,
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.SMALL
                },
                panControl: false,
                linksControl: false,
                streetViewControl: false,
                overviewMapControl: false,
                scaleControl: false,
                rotateControl: false,
                mapTypeControl: true,
                mapTypeControlOptions: {
                    style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR
                },
                styles: [
                    {"featureType": "landscape",
                        "stylers": [
                            {"hue": "#FFA800"},
                            {"saturation": 0},
                            {"lightness": 0},
                            {"gamma": 1}
                        ]
                    },
                    {"featureType": "road.highway",
                        "stylers": [
                            {"hue": "#53FF00"},
                            {"saturation": -73},
                            {"lightness": 40},
                            {"gamma": 1}
                        ]
                    },
                    {"featureType": "road.arterial",
                        "stylers": [
                            {"hue": "#FBFF00"},
                            {"saturation": 0},
                            {"lightness": 0},
                            {"gamma": 1}
                        ]
                    },
                    {"featureType": "road.local",
                        "stylers": [
                            {"hue": "#00FFFD"},
                            {"saturation": 0},
                            {"lightness": 30},
                            {"gamma": 1}
                        ]
                    },
                    {"featureType": "water",
                        "stylers": [
                            {"saturation": 43},
                            {"lightness": -11},
                            {"hue": "#0088ff"}
                        ]
                    },
                    {"featureType": "poi",
                        "stylers": [
                            {"hue": "#679714"},
                            {"saturation": 33.4},
                            {"lightness": -25.4},
                            {"gamma": 1}
                        ]
                    }
                ]
            };
            this.map = new google.maps.Map(mapCanvas ,mapOptions);
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(-25.363, 131.044),
                map: app.controller.sref.map,
                icon: 'http://maps.google.com/mapfiles/marker_green.png',
                draggable:true
            });
            marker.setVisible(false);

            var update_timeout = null; //to clear changing of marker on double click
            google.maps.event.addListener(this.map, 'click', function(event) {
                //have to wait for double click
                update_timeout = setTimeout(function () {
                    var latLng = event.latLng;
                    marker.setPosition(latLng);
                    marker.setVisible(true);
                    updateMapCoords(latLng);
                }, 200);
            });

            //removes single click action
            google.maps.event.addListener(this.map, 'dblclick', function(event) {
                clearTimeout(update_timeout);
            });

            google.maps.event.addListener(marker, 'dragend', function(){
                var latLng = marker.getPosition();
                updateMapCoords(latLng);
            });

            //Set map centre
            if(this.latitude != null && this.longitude != null){
                var latLong = new google.maps.LatLng(this.latitude, this.longitude);
                app.controller.sref.map.setCenter(latLong);
                app.controller.sref.map.setZoom(15);
            } else if (navigator.geolocation) {
                //Geolocation
                var options = {
                    enableHighAccuracy: true,
                    maximumAge: 60000,
                    timeout: 5000
                };

                navigator.geolocation.getCurrentPosition(function(position) {
                    var latLng = new google.maps.LatLng(position.coords.latitude,
                        position.coords.longitude);
                    app.controller.sref.map.setCenter(latLng);
                    app.controller.sref.map.setZoom(15);
                }, null, options);
            }

            this.fixTabMap("#sref-opts", '#map');

            //todo: create event
            $('#sref-opts').enableTab(1);

            function updateMapCoords(mapLatLng){
                var location = {
                        'lat': mapLatLng.lat(),
                        'lon': mapLatLng.lng()
                };
                app.controller.sref.set(location.lat, location.lon, 1);

                updateMapInfoMessage('#map-message', location);
            }

            function updateMapInfoMessage(id, location){
                //convert coords to Grid Ref
                var p = new LatLonE(location.lat, location.lon, GeoParams.datum.OSGB36);
                var grid = OsGridRef.latLonToOsGrid(p);
                var gref = grid.toString();

                var message = $(id);
                message.removeClass();
                message.addClass('success-message');
                message.empty().append('<p>Grid Ref:<br/>' + gref + '</p>');
            }
        },

        /**
         * Fix one tile rendering in jQuery tabs
         * @param tabs
         * @param mapTab
         */
        fixTabMap : function(tabs, mapTab){
            $(tabs).on("tabsactivate.googleMap", function(event, ui){
                    //check if this is a map tab
                    if(ui['newPanel']['selector'] == mapTab){
                        google.maps.event.trigger( app.controller.sref.map, 'resize' );
                        if(app.controller.sref.latitude != null && app.controller.sref.longitude != null){
                            var latLong = new google.maps.LatLng(app.controller.sref.latitude,
                                app.controller.sref.longitude);

                            app.controller.sref.map.setCenter(latLong);
                            app.controller.sref.map.setZoom(15);
                        }
                        $(tabs).off("tabsactivate.googleMap");
                    }
                }
            );
        },

        gridRefConvert : function(){
                var val = $('#grid-ref').val();
                var gridref = OsGridRef.parse(val);
                if(!isNaN(gridref.easting) && !isNaN(gridref.northing)){
                    var latLon = OsGridRef.osGridToLatLon(gridref);
                    this.set(latLon.lat, latLon.lon, 1);

                    var gref = val.toUpperCase();
                    var message = $('#gref-message');
                    message.removeClass();
                    message.addClass('success-message');
                    message.empty().append('<p>Grid Ref:<br/>' + gref + '</p>');
                }
                //todo: set accuracy dependant on Gref
        },

        startGeoloc : function(){
            $.mobile.loading('show');

            function onSuccess(location){
                $.mobile.loading('hide');
                var page_id = $.mobile.activePage.attr('id');

                switch(page_id){
                    case 'record':
                        app.controller.record.saveSref(location);
                        break;
                    case 'sref':
                        app.controller.sref.set(location.lat, location.lon, location.acc);

                        var p = new LatLonE(location.lat, location.lon, GeoParams.datum.OSGB36);
                        var grid = OsGridRef.latLonToOsGrid(p);
                        var gref = grid.toString();

                        var message = $('#gps-start-message');
                        message.removeClass();
                        message.addClass('success-message');
                        message.empty().append(
                            '<p>Success!</p> ' +
                            '<p>Grid Ref:<br/> ' +
                            gref + '<br/>' +
                            'Accurracy: ' + location.acc + 'm</p>');
                        break;
                    case 'setup':
                        break;
                    default:
                        _log('sref: ERROR gps save success - unknown page to go.');
                }

            }
            function onError(err){
                $.mobile.loading( 'show', {
                    text: "Sorry! " + err.message + '.',
                    theme: "b",
                    textVisible: true,
                    textonly: true
                });
                setTimeout(function(){
                    $.mobile.loading('hide');
                }, 5000);
            }
            app.geoloc.run(onSuccess, onError);
        }
    };

}(jQuery));