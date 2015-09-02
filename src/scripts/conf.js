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
            URL: "http://192.171.199.230/mobile-drupal/user/mobile/register",
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
        url: 'http://192.171.199.230/mobile-drupal/mobile/submit',
        appname: "test",
        appsecret: "mytest",
        website_id: 99,
        survey_id: 178,
        Storage: morel.DatabaseStorage
    };

    $.extend(true, morel.Sample.keys, {
        name: {
            id: 12
        },
        surname: {
            id: 13
        },
        email: {
            id: 9
        },
        location_accuracy: {
            id: 273
        },
        recorded_all: {
            id: 115
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

    $.extend(true, morel.Occurrence.keys, {
        number: {
            id: 285, values: numberRanges
        },
        adult: {
            id: 48, values: numberRanges
        },
        copulating: {
            id: 49, values: numberRanges
        },
        ovipositing: {
            id: 50, values: numberRanges
        },
        larvae: {
            id: 51, values: numberRanges
        },
        exuviae: {
            id: 52, values: numberRanges
        },
        emergent: {
            id: 53, values: numberRanges
        },
        stage: {
            id: 286,
            values: {
                Adult: 3640,
                Copulating: 3641,
                Ovipositing: 3642,
                Larvae: 3643,
                Exuviae: 3644,
                Emergent: 3645
            }
        },
        certain: {
            id: 223
        },
        taxon: {
            values: {
                1: 112974,
                2: 112968,
                3: 112970,
                4: 112972,
                5: 112928,
                6: 112930,
                7: 112992,
                8: 112932,
                9: 112934,
                10: 112938,
                11: 112940,
                12: 112942,
                13: 112944,
                14: 112952,
                15: 112954,
                16: 112956,
                17: 112964,
                18: 112966,
                19: 112994,
                20: 112906,
                21: 112908,
                22: 112910,
                23: 112912,
                24: 112916,
                25: 112918,
                26: 112914,
                27: 112920,
                28: 112924,
                29: 112926,
                30: 112960,
                31: 112946,
                32: 112948,
                33: 112996,
                34: 112998,
                35: 112976,
                36: 112978,
                37: 112980,
                38: 112982,
                39: 112984,
                40: 112986,
                41: 113002,
                42: 113006,
                43: 113010,
                44: 113012,
                45: 878675
            }
        }
    });
});