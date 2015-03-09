define([
  'views/_page',
  'templates',
  'morel',
  'conf'
], function (Page) {
  'use strict';

  var CommentPage = Page.extend({
    id: 'comment',

    template: app.templates.comment,

    events: {
      'click #comment-save': 'save'
    },

    initialize: function () {
      _log('views.CommentPage: initialize', app.LOG_DEBUG);

      this.render();
      this.appendBackButtonListeners();
    },

    render: function () {
      _log('views.CommentPage: render', app.LOG_DEBUG);

      this.$el.html(this.template());

      $('body').append($(this.el));
      return this;
    },

    save: function () {
      var name = morel.record.inputs.KEYS.COMMENT;
      var ele = document.getElementById(name);
      var value = $(ele).val();
      if (value !== "") {
        this.model.set(name, value);
      }
      window.history.back();
    }
  });

  return CommentPage;
});
