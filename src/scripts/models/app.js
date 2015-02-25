define([
  'backbone',
  'backbone.localStorage',
  'conf'
], function (Backbone) {

  'use strict';

  var App = Backbone.Model.extend({

    id: 'app',

    localStorage: new Store(app.CONF.NAME),

    initialize: function () {
      this.fetch();
      if (!this.get('appVer')) {
        this.save ('appVer', app.CONF.VERSION);
      }
    }

  });

  return App;
});