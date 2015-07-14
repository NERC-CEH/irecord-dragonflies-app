/******************************************************************************
 * Main app configuration file.
 *****************************************************************************/
define(['morel', 'helpers/log'], function () {
    app = window.app || {};

    app.VERSION = '0'; //version grunt replaced
    app.NAME = 'app'; //name grunt replaced

    app.CONF = {
        //app feature settings
        OFFLINE: {
            STATUS: true,
            APPCACHE_URL: "appcache.html"
        },
        GA: {
            //Google Analytics settings
            STATUS: true,
            ID: 'UA-58378803-2'
        },
        LOGIN: {
            STATUS: true,
            URL: "http://192.171.199.230/irecord7/user/mobile/register",
            TIMEOUT: 80000
        },
        SEND_RECORD: {
            STATUS: true,
            URL: "http://192.171.199.230/irecord7/mobile/submit"
        },
        REGISTER: {
            STATUS: true
        },
        LIST: {
            DEFAULT_SORT: 'taxonomic'
        },
        MAP: {
            zoom: 5,
            zoomControl: true,
            zoomControlOptions: {
                style: 1
            },
            panControl: false,
            linksControl: false,
            streetViewControl: false,
            overviewMapControl: false,
            scaleControl: false,
            rotateControl: false,
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: 1
            },
            styles: [
                {
                    "featureType": "landscape",
                    "stylers": [
                        {"hue": "#FFA800"},
                        {"saturation": 0},
                        {"lightness": 0},
                        {"gamma": 1}
                    ]
                },
                {
                    "featureType": "road.highway",
                    "stylers": [
                        {"hue": "#53FF00"},
                        {"saturation": -73},
                        {"lightness": 40},
                        {"gamma": 1}
                    ]
                },
                {
                    "featureType": "road.arterial",
                    "stylers": [
                        {"hue": "#FBFF00"},
                        {"saturation": 0},
                        {"lightness": 0},
                        {"gamma": 1}
                    ]
                },
                {
                    "featureType": "road.local",
                    "stylers": [
                        {"hue": "#00FFFD"},
                        {"saturation": 0},
                        {"lightness": 30},
                        {"gamma": 1}
                    ]
                },
                {
                    "featureType": "water",
                    "stylers": [
                        {"saturation": 43},
                        {"lightness": -11},
                        {"hue": "#0088ff"}
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "labels",
                    "stylers": [
                        { "visibility": "off" }
                    ]
                }
            ]
        }
    };

    //logging
    log.CONF = {
        STATE: log.DEBUG,
        GA_ERROR: true //log error using google analytics
    };

    //morel configuration
    app.CONF.morel = {
        url: 'http://192.171.199.230/irecord7/mobile/submit',
        appname: "test",
        appsecret: "mytest",
        website_id: 23,
        survey_id: 256
    };

    $.extend(morel.Sample.KEYS, {
        LOCATION_ACCURACY: {
            name: 'smpXXX:accurracy'
        },
        FULL_LIST: {
            name: 'smpAttr:full_list',
            values: {
                TRUE: 'true',
                FALSE: 'false'
            }
        }
    });

    $.extend(morel.Occurrence.KEYS, {
        NUMBER: {
            name: 'occAttr:379',
            values: {
                '1': 665,
                '2-5': 666,
                '6-20': 667,
                '21-100': 668,
                '101-500': 669,
                '500+': 670,
                'Present': 671 //default
            }
        },
        STAGE: {
            name: 'occAttr:378',
            values: {
                Adult: 4756,
                Copulating: 4757,
                Ovipositing: 4758,
                Larva: 4759,
                Exuvia: 4760,
                Emergent: 4761
            }
        },
        CERTAIN: {
            name: 'occAttr:32',
            values: {
                TRUE: 663,
                FALSE: 664 //default
            }
        }
    });
});