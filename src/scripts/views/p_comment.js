/******************************************************************************
 * Comment page view.
 *****************************************************************************/
define([
  'views/_page',
  'templates',
  'morel',
  'conf'
], function (Page) {
  'use strict';

  var CommentPage = Page.extend({
    id: 'comment',

    template: app.templates.p_comment,

    events: {
      'click #comment-save': 'save'
    },

    initialize: function () {
      _log('views.CommentPage: initialize', log.DEBUG);

      this.render();

      this.$input = $('#record-comment');

      this.appendEventListeners();
    },

    render: function () {
      _log('views.CommentPage: render', log.DEBUG);

      this.$el.html(this.template());
      $('body').append($(this.el));
      return this;
    },

    /**
     * Reset the page.
     */
    update: function () {
      var value = this.model.get(this.id);
      if (!value) {
        this.$input.val('');
      }
    },

    appendEventListeners: function () {
      this.listenTo(this.model, 'change:' + this.id, this.update);

      this.appendBackButtonListeners();
    },

    /**
     * Saves the comment to record.
     */
    save: function () {
      var value = this.$input.val();
      if (value !== "") {
        this.model.set(this.id, value);
      }
      window.history.back();
    }
  });

  return CommentPage;
});
