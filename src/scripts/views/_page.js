define([
  'backbone'
], function (Backbone) {
  'use strict';

  var Page = Backbone.View.extend({
    tagName: 'div',
    role: "page",

    initialize: function (id) {
      _log('views.Page(' + id + '): initialize', log.DEBUG);

      this.el.id = id;
      this.id = id;
      this.template = app.templates[id];

      this.render();

      $('body').append($(this.el));

      this.appendBackButtonListeners();
    },

    render: function () {
      _log('views.Page(' + this.id + '): render', log.DEBUG);

      $(this.el).html(this.template());
      return this;
    },

    attributes: function () {
      return {
        "data-role": this.role
      };
    },

    appendBackButtonListeners: function () {
      _log('views.Page(' + this.id + '): appending Back button listeners', log.DEBUG);

      this.$el.find('a[data-rel="back"]').on('click', function (e) {
        window.history.back();
        return false;
      });
    }
  });

  return Page;
});