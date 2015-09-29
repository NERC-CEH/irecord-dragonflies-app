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
            URL: "https://www.brc.ac.uk/irecord/user/mobile/register",
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
                style: 2,
                position: 5
            },
            panControl: false,
            linksControl: false,
            streetViewControl: false,
            overviewMapControl: false,
            scaleControl: false,
            rotateControl: false,
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: 1,
                position: 7
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
        url: 'https://www.brc.ac.uk/irecord/mobile/submit',
        appname: "ird",
        appsecret: "irdpass",
        website_id: 23,
        survey_id: 350,
        Storage: morel.DatabaseStorage
    };

    $.extend(true, morel.Sample.keys, {
        name: {
            id: 6
        },
        surname: {
            id: 7
        },
        email: {
            id: 8
        },
        location_accuracy: {
            id: 282
        },
        recorded_all: {
            id: 62
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

    $.extend(true, morel.Occurrence.keys, {
        number: {
            id: 505, values: numberRanges
        },
        adult: {
            id: 34, values: numberRanges
        },
        copulating: {
            id: 35, values: numberRanges
        },
        ovipositing: {
            id: 36, values: numberRanges
        },
        larvae: {
            id: 37, values: numberRanges
        },
        exuviae: {
            id: 38, values: numberRanges
        },
        emergent: {
            id: 39, values: numberRanges
        },
        stage: {
            id: 506,
            values: {
                Adult: 5703,
                Copulating: 5704,
                Ovipositing: 5705,
                Larvae: 5706,
                Exuviae: 5707,
                Emergent: 5708
            }
        },
        certain: {
            id: 32,
            values: {
                'true': 663,
                'false': 664
            }
        },
        taxon: {
            values: {
                1: 272198,
                2: 272192,
                3: 272194,
                4: 272196,
                5: 272152,
                6: 272154,
                7: 272216,
                8: 272156,
                9: 272158,
                10: 272162,
                11: 272164,
                12: 272166,
                13: 272168,
                14: 272174,
                15: 272178,
                16: 272180,
                17: 272188,
                18: 272190,
                19: 272218,
                20: 272130,
                21: 272132,
                22: 272134,
                23: 272136,
                24: 272140,
                25: 272142,
                26: 272138,
                27: 272144,
                28: 272148,
                29: 272150,
                30: 272184,
                31: 272170,
                32: 272172,
                33: 272220,
                34: 272222,
                35: 272200,
                36: 272202,
                37: 272204,
                38: 272206,
                39: 272208,
                40: 272210,
                41: 272226,
                42: 272228,
                43: 272234,
                44: 272236,
                45: 107
            }
        }
    });
});