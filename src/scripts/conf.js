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
            id: 12
        },
        SURNAME: {
            id: 13
        },
        EMAIL: {
            id: 9
        },
        LOCATION_ACCURACY: {
            id: 273
        },
        RECORDED_ALL: {
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

    $.extend(morel.Occurrence.KEYS, {
        NUMBER: {
            id: 285, values: numberRanges
        },
        ADULT: {
            id: 48, values: numberRanges
        },
        COPULATING: {
            id: 49, values: numberRanges
        },
        OVIPOSITING: {
            id: 50, values: numberRanges
        },
        LARVAE: {
            id: 51, values: numberRanges
        },
        EXUVIAE: {
            id: 52, values: numberRanges
        },
        EMERGENT: {
            id: 53, values: numberRanges
        },
        STAGE: {
            id: 286,
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
            id: 223
        },
        TAXON: {
            values: {
                1: 4617,
                2: 4696,
                3: 4612,
                4: 4615,
                5: 4609,
                6: 4611,
                7: 4644,
                8: 4642,
                9: 4618,
                10: 4622,
                11: 4627,
                12: 4628,
                13: 4624,
                14: 4637,
                15: 4630,
                16: 4632,
                17: 4639,
                18: 4640,
                19: 4635,
                20: 4700,
                21: 4646,
                22: 4648,
                23: 4650,
                24: 4654,
                25: 4656,
                26: 4652,
                27: 4658,
                28: 4660,
                29: 4662,
                30: 4665,
                31: 4666,
                32: 4668,
                33: 4671,
                34: 4673,
                35: 4674,
                36: 4677,
                37: 4678,
                38: 4681,
                39: 4683,
                40: 4685,
                41: 4687,
                42: 4691,
                43: 4693,
                44: 4695,
                45: 878675
            }
        }
    });
});