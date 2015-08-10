/******************************************************************************
 * Main app configuration file.
 *****************************************************************************/
define(['morel', 'helpers/log'], function () {
    app = window.app || {};

    app.VERSION = '0'; //version grunt replaced
    app.NAME = 'app'; //name grunt replaced

    app.CONF = {
        GPS_ACCURACY_LIMIT: 100,

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
        survey_id: 256,
        Storage: morel.DatabaseStorage
    };

    $.extend(morel.Sample.KEYS, {
        LOCATION_ACCURACY: {
            id: 'accurracy'
        },
        RECORDEDALL: {
            id: '2222',
            values: {
                'true': 663,
                'false': 664
            }
        }
    });

    var numberRanges = {
        '1': 665,
        '2-5': 666,
        '6-20': 667,
        '21-100': 668,
        '101-500': 669,
        '500+': 670,
        'Present': 671 //default
    };

    $.extend(morel.Occurrence.KEYS, {
        NUMBER: {
            id: '379', values: numberRanges
        },
        ADULT: {
            id: '7879997', values: numberRanges
        },
        COPULATING: {
            id: '9998', values: numberRanges
        },
        OVIPOSITING: {
            id: '78787879', values: numberRanges
        },
        LARVAE: {
            id: '789787', values: numberRanges
        },
        EXUVIAE: {
            id: '78798', values: numberRanges
        },
        EMERGENT: {
            id: '8797987', values: numberRanges
        },
        STAGE: {
            id: '378',
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
            id: '32',
            values: {
                TRUE: 663,
                FALSE: 664 //default
            }
        }
    });
});