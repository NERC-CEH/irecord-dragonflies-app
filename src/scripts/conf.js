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
            URL: "http://192.171.199.230/dragonfly/user/mobile/register",
            TIMEOUT: 80000
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
        url: 'http://192.171.199.230/dragonfly/mobile/submit',
        appname: "test",
        appsecret: "mytest",
        website_id: 99,
        survey_id: 178,
        Storage: morel.DatabaseStorage
    };

    $.extend(morel.Sample.KEYS, {
        NAME: {
            id: '12'
        },
        SURNAME: {
          id: '13'
        },
        EMAIL: {
            id: '9'
        },
        LOCATION_ACCURACY: {
            id: '273'
        },
        RECORDED_ALL: {
            id: '115',
            values: {
                'true': 1,
                'false': 0
            }
        }
    });

    var numberRanges = {
        '1': 760,
        '2-5': 761,
        '6-20': 762,
        '21-100': 763,
        '101-500': 764,
        '500+': 765,
        'Present': 766 //default
    };

    $.extend(morel.Occurrence.KEYS, {
        NUMBER: {
            id: '285', values: numberRanges
        },
        ADULT: {
            id: '48', values: numberRanges
        },
        COPULATING: {
            id: '49', values: numberRanges
        },
        OVIPOSITING: {
            id: '50', values: numberRanges
        },
        LARVAE: {
            id: '51', values: numberRanges
        },
        EXUVIAE: {
            id: '52', values: numberRanges
        },
        EMERGENT: {
            id: '53', values: numberRanges
        },
        STAGE: {
            id: '286',
            values: {
                Adult: 3640,
                Copulating: 3641,
                Ovipositing: 3642,
                Larva: 3643,
                Exuviae: 3644,
                Emergent: 3645
            }
        },
        CERTAIN: {
            id: '223',
            values: {
                TRUE: 1, //default
                FALSE: 0
            }
        }
    });
});