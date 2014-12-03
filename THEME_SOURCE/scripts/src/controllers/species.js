(function ($)
{
    app.controller = app.controller || {};
    app.controller.species = {

        //controller configuration should be set up in an app config file
        CONF: {
            FLIGHT_DATA_SRC: ""
        },

        pagecreate: function ()
        {
            //fetch flight data from the server
            //load species data
            if (!app.storage.is('flight')) {
                $.mobile.loading("show");

                $.ajax({
                    url: this.CONF.FLIGHT_DATA_SRC,
                    dataType: 'jsonp',
                    async: false,
                    success: function (json)
                    {
                        $.mobile.loading("hide");

                        var flight = optimiseData(json);
                        app.data.flight = flight;

                        function optimiseData(json)
                        {
                            //optimise data
                            var data = {};
                            for (var i = 0; i < json.length; i++) {
                                var a = json[i];
                                data[a['s']] = data[a['s']] || {};
                                data[a['s']][a['m']] = a['c'];
                            }
                            return data;
                        }

                        //render flight data
                        app.controller.species.addFlightData();

                        //saves for quicker loading
                        app.storage.set('flight', flight);

                    }
                });
            } else {
                app.data.flight = app.storage.get('flight');
            }
        },

        pagecontainershow: function (event, ui)
        {
            _log('species: pagecontainershow.');

            var species = app.controller.list.getCurrentSpecies();

            var heading = $('#species_heading');
            heading.text(species.common_name);

            this.renderSpecies(species);
        },

        /**
         * Renders the species profile page.
         * @param species
         */
        renderSpecies: function (species)
        {
            var template = $('#species-template').html();
            var placeholder = $('#species-placeholder');

            var compiled_template = Handlebars.compile(template);

            //check for the favourite
            var favourites = app.controller.list.getFavourites();
            if (favourites[species.id] != null) {
                $("#species-profile-fav-button").addClass("on");
            } else {
                $("#species-profile-fav-button").removeClass("on");
            }

            //add national boundary
            species['national_boundary'] = Drupal.settings.basePath + app.controller.list.CONF.NATIONAL_BOUNDARY_SRC;

            placeholder.html(compiled_template(species));
            placeholder.trigger('create');

            //add Flight data
            this.addFlightData();

            //add Gallery
            app.controller.species.gallery.init();

            //add button listeners
            $('#species-map-button, #species-map').on('click', function ()
            {
                $('#species-map').toggle('slow');
            });

            var map = $('#species-map');

            var WIDTH = map.width(),
                HEIGHT = map.height(),
                MARGINS = {
                    top: HEIGHT * 0.04,
                    right: WIDTH * 0.05,
                    bottom: HEIGHT * 0.55,
                    left: WIDTH * 1.1
                };

          //  map.attr('width', WIDTH);
          //  map.attr('height', HEIGHT);
//            map.attr('viewBox',
//                MARGINS.top + ',' +
//                MARGINS.right + ',' +
//                MARGINS.bottom  + ',' +
//                MARGINS.left
//            );

            var scale = WIDTH / 345;
            var map_boundary = $('#species-map-boundary');
            map_boundary.attr('transform', 'scale(' + scale + ')');
            var map_data = $('#species-map-data');
            map_data.attr('transform', 'scale(' + scale + ')');
        },

        /**
         * Adds fight histograms to the species profile.
         */
        addFlightData: function ()
        {
            var container = $('#species-flight');

            //if server data came earlier than the page was rendered
            if (container.length == 0) {
                return;
            }
            var species = app.controller.list.getCurrentSpecies();
            var flight_data = app.data.flight[species.id];

            if (flight_data == null) {
                _log('species: no filght data was found for: ' + species.id, app.LOG_ERROR);
                return;
            }

            var data = [];

            var WEEKS_IN_YEAR = 52;
            for (var i = 0; i < WEEKS_IN_YEAR; i++) {
                data.push({
                    'x': i,
                    'y': flight_data[i] / 10 || 0
                });
            }
            this.renderFlightData(data);
        },

        /**
         * Creates SVG using D3 lib and attaches it to the Species profile.
         *
         * Code from: http://www.sitepoint.com/creating-simple-line-bar-charts-using-d3-js/
         */
        renderFlightData: function (barData)
        {
            var container = $('#species-flight');

            var WIDTH = container.width(),
                HEIGHT = container.height(),
                MARGINS = {
                    top: 0,
                    right: WIDTH * 0.05,
                    bottom: HEIGHT * 0.2,
                    left: 0
                };

            var xScale = d3.scale.ordinal().rangeRoundBands([MARGINS.left, WIDTH - MARGINS.right], 0.1)
                .domain(barData.map(
                    function (d){
                        return d.x;
                    }
                ));

            var yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom])
                .domain([0, d3.max(barData,
                    function (d) {
                        return d.y;
                    }
                )]);

            var xAxis = d3.svg.axis()
                .scale(xScale)
                .tickFormat(function(weekNum){
                    var MONTH_SPACE = 8; //display tick every so weeks

                    var width = $('#species-flight').width();
                    if (width > 300) {
                        MONTH_SPACE = 4;
                    }

                    //display only monthly tick labels
                    if (weekNum % MONTH_SPACE > 0 || weekNum == 0){
                        return;
                    }
                    var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

                    var d = ( (weekNum) * 7); // 1st of January + 7 days for each week
                    var monthNum = new Date(2014, 0, d).getMonth();
                    var month = monthNames[monthNum];

                    return month;
                });

            var yAxis = d3.svg.axis()
                .scale(yScale)
                .tickValues([0, 100])
                .orient("left");


            // Add an SVG element with the desired dimensions and margin.
            var graph = d3.select("#species-flight").append("svg:svg")
                .attr("width", WIDTH + MARGINS.right + MARGINS.left)
                .attr("height", HEIGHT + MARGINS.top + MARGINS.bottom)
                .append("svg:g");
               // .attr("transform", "translate(" + MARGINS.bottom + "," + MARGINS.top + ")");

            graph.append('svg:g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
                .call(xAxis);

            graph.selectAll('rect')
                .data(barData)
                .enter()
                .append('rect')
                .attr('x', function (d){
                        return xScale(d.x);
                    }
                 )
                .attr('y', function (d) {
                        return yScale(d.y);
                    }
                )
                .attr('width', xScale.rangeBand())
                .attr('height', function (d) {
                    //trim negative ones
                    var height = ((HEIGHT - MARGINS.bottom) - yScale(d.y));
                    return height > 0 ? height : 0;
                })
                .attr('fill', '#C6C99F')
                .on('mouseover', function (d) {
                    d3.select(this)
                        .attr('fill', '#E2E4CD');
                })
                .on('mouseout', function (d) {
                    d3.select(this)
                        .attr('fill', '#C6C99F');
                });

            //attach graph bar count label
            graph.append("text")
                .attr('id', 'bar-count')
                .attr('font-size', 10)
                .attr("y", -20) //hide in the beginning
                .attr("x", -20)
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("");

            //attach bar click listeners
            $('rect').on('click', function(){
                var count = this.height.baseVal.value;
                var x = this.x.baseVal.value;

                var counter = $('#bar-count');
                counter.attr('y', (HEIGHT - count  - MARGINS.bottom) - 15); // -15 to lift it slightly up
                counter.attr('x', x + 5); //needs slight incrementation to stay in middle of bar
                counter.text(count.toFixed(0));
            });
        },

        /**
         * Toggles the current species as favourite by saving it into the
         * storage and changing the buttons appearance.
         */
        toggleSpeciesFavourite: function ()
        {
            var favButton = $("#species-profile-fav-button");
            favButton.toggleClass("on");

            var species = app.controller.list.getCurrentSpecies();
            app.controller.list.changeFavourite(species.id, favButton.hasClass('on'));
        },

        /**
         *
         */
        gallery: {

            gallery: {},
            init: function (gallery_id)
            {
                var images = $('#species_gallery a');

                if (images.length > 0) {
                    this.gallery = images.photoSwipe({
                        jQueryMobile: true,
                        loop: false,
                        enableMouseWheel: false,
                        enableKeyboard: false
                    });
                }

            },

            show: function ()
            {
                if ($('.gallery')) {
                    this.gallery.show(0);
                } else {
                    app.navigation.message('I have no pictures to show :(');
                }

            }
        }
    };
}(jQuery));

