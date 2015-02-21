var app = app || {};
app.views = app.views || {};

(function () {
  'use strict';

  app.views.SpeciesPage = app.views.Page.extend({
    id: 'species',

    template: app.templates.species,

    events: {
      'click #species-profile-fav-button': 'toggleSpeciesFavourite',
      'click #species-map': 'toggleMap',
      'click #species-map-button': 'toggleMap',
      'click #profile_pic': 'showGallery'
    },

    initialize: function () {
      _log('views.SpeciesPage: initialize', app.LOG_DEBUG);

      this.render();
      this.appendBackButtonListeners();
    },

    render: function () {
      _log('views.SpeciesPage: render', app.LOG_DEBUG);

      this.$el.html(this.template());
      $('body').append($(this.el));
    },

    update: function (speciesID) {
      this.model = app.collections.species.find({id: speciesID});

      var $heading = $('#species_heading');
      $heading.text(this.model.attributes.common_name);

      //append the profile
      var $profile = this.$el.find('#species-profile-placeholder');
      var profileView = new SpeciesProfile({model: this.model});
      $profile.html(profileView.render().el);
      $profile.trigger('create');

      //turn on/off fav button
      var $favButton = $("#species-profile-fav-button");
      if (app.models.user.isFavourite(speciesID)) {
        $favButton.addClass("on");
      } else {
        $favButton.removeClass("on");
      }

      //add Gallery
      this.initGallery();

      //add Flight profile
      this.addFlightData();

    },

    /**
     * Toggles the current species as favourite by saving it into the
     * storage and changing the buttons appearance.
     */
    toggleSpeciesFavourite: function (e) {
      var $favButton = $(e.target);
      $favButton.toggleClass("on");
      var speciesID = this.model.get('id');
      app.models.user.toggleFavouriteSpecies(speciesID);
    },

    /**
     * Renders the species profile page.
     * @param species
     */
      //todo: old
    renderSpecies: function (species) {
      var placeholder = $('#species-placeholder');

      //check for the favourite
      var favourites = app.controller.list.getFavourites();
      var $favButton = $("#species-profile-fav-button");
      if (favourites[species.id]) {
        $favButton.addClass("on");
      } else {
        $favButton.removeClass("on");
      }

      placeholder.html(app.templates.species_profile(species));
      placeholder.trigger('create');

      //add Gallery
      app.controller.species.gallery.init();

      this.addFlightData();

      var scale = $('#species-map').width() / 345;
      var margin = $('#species-map').height() * 0.05;

      $('#species-map-boundary')
        .attr('transform', 'scale(' + scale + ')')
        .attr('y', -margin);
      $('#species-map-data').attr('transform', 'scale(' + scale + ')')
        .attr('y', -margin);
    },

    /**
     * Adds fight histograms to the species profile.
     */
    addFlightData: function () {
      //gracefully fallback and not break anything else if not found.
      if (app.data.flight == null || app.data.flight == 'undefined') {
        _log('species: app.data.flight not found', app.LOG_ERROR);
        return;
      }
      var container = $('#species-flight');

      //if server data came earlier than the page was rendered
      if (container.length == 0) {
        return;
      }

      var speciesID = this.model.get('id');
      var flight_data = app.data.flight[speciesID];

      if (flight_data == null) {
        _log('species: no filght data was found for: ' + speciesID, app.LOG_ERROR);
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
    renderFlightData: function (barData) {
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
          function (d) {
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
        .tickFormat(function (weekNum) {
          var MONTH_SPACE = 8; //display tick every so weeks

          var width = $('#species-flight').width();
          if (width > 300) {
            MONTH_SPACE = 4;
          }

          //display only monthly tick labels
          if (weekNum % MONTH_SPACE > 0 || weekNum == 0) {
            return;
          }
          var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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

      var BAR_WIDTH = xScale.rangeBand();
      if (WIDTH < 300) {
        BAR_WIDTH = 3; //small bar width for small screens
      }
      graph.selectAll('rect')
        .data(barData)
        .enter()
        .append('rect')
        .attr('x', function (d) {
          return xScale(d.x);
        }
      )
        .attr('y', function (d) {
          return yScale(d.y);
        }
      )
        .attr('width', BAR_WIDTH)
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
      $('rect').on('click', function () {
        var count = this.height.baseVal.value;
        var x = this.x.baseVal.value;

        var counter = $('#bar-count');
        counter.attr('y', (HEIGHT - count - MARGINS.bottom) - 15); // -15 to lift it slightly up
        counter.attr('x', x + 5); //needs slight incrementation to stay in middle of bar
        counter.text(count.toFixed(0));
      });
    },

    toggleMap: function () {
      $('#species-map').toggle('slow');
    },

    showGallery: function () {
      if ($('.gallery')) {
        this.gallery.show(0);
      } else {
        app.message('I have no pictures to show :(');
      }
    },

    initGallery: function () {
      var images = $('#species_gallery a');

      if (images.length > 0) {
        this.gallery = images.photoSwipe({
          jQueryMobile: true,
          loop: false,
          enableMouseWheel: false,
          enableKeyboard: false
        });
      }
    }
  });

  var SpeciesProfile = Backbone.View.extend({
    template: app.templates.species_profile,

    render: function () {
      this.$el.html(this.template(this.model.attributes));
      return this;
    }
  });
})();

