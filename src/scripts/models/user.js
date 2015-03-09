define([
  'backbone',
  'backbone.localStorage',
  'conf'
], function (Backbone) {
  'use strict';

  var User = Backbone.Model.extend({
    id: 'user',

    defaults: {
      name: '',
      email: '',
      secret: '',
      location: null,
      location_acc: -1,
      sort: 'common_name',
      filters: [],
      favourites: []
    },

    initialize: function () {
      this.fetch();
    },

    localStorage: new Store(app.CONF.NAME),

    signOut: function () {
      this.set('email', '');
      this.set('secret', '');
      this.set('name', '');

      this.save();
    },

    /**
     * Sets the app login state of the user account.
     *
     * Saves the user account details into storage for permanent availability.
     * @param user User object or empty object
     */
    signIn: function (user) {
      this.set('email', user.email);
      this.set('secret', user.secret);
      this.set('name', user.name);
      this.save()
    },

    saveLocation: function (location) {
      this.set('location', location.lat + ', ' + location.lon);
      this.set('location_acc', location.acc);
      this.save();
    },

    getLocationSref: function (geoloc) {
      var LOCATION_GRANULARITY = 2; //Precision of returned grid reference (6 digits = metres).

      geoloc = geoloc || this.get('location');
      if (!geoloc) {
        return null;
      }
      //get translated geoloc
      var p = new LatLonE(geoloc.split(',')[0], geoloc.split(',')[1], LatLonE.datum.OSGB36);
      var grid = OsGridRef.latLonToOsGrid(p);
      var gref = grid.toString(LOCATION_GRANULARITY);
      _log('models.user: converted geoloc to sref -  ' + gref + ".");

      //remove the spaces
      return gref.replace(/ /g, '');
    },


    toggleFavouriteSpecies: function (speciesID) {
      var favourites = _.clone(this.get('favourites'));  //CLONING problem as discussed:
      //https://stackoverflow.com/questions/9909799/backbone-js-change-not-firing-on-model-change

      if (_.indexOf(favourites, speciesID) >= 0) {
        favourites = _.without(favourites, speciesID);
      } else {
        favourites.push(speciesID);
      }

      this.save('favourites', favourites);
    },

    isFavourite: function (speciesID) {
      var favourites = this.get('favourites');
      return _.indexOf(favourites, speciesID) >= 0;
    },

    toggleListFilter: function (filterID) {
      var filters = _.clone(this.get('filters'));  //CLONING problem as discussed:
      //https://stackoverflow.com/questions/9909799/backbone-js-change-not-firing-on-model-change

      var exists = this.hasListFilter(filterID, filters);
      if (exists) {
        filters = _.without(filters, filterID);
      } else {
        filters.push(filterID);
      }

      this.set('filters', filters);
      this.save();

      return !exists; //return the state of the filter added/removed
    },

    hasListFilter: function (filterID, filters) {
      filters = filters || this.get('filters');
      return _.indexOf(filters, filterID) >= 0;
    }
  });

  return User;
});