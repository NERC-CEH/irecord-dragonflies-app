define([
  'views/_page',
  'templates',
  'morel'
], function (Page) {
  'use strict';

  var StagePage = Page.extend({
    id: 'stage',

    warehouse_id: morel.record.inputs.KEYS.STAGE,

    template: app.templates.stage,

    events: {
      'change input[type=radio]': 'save'
    },

    initialize: function () {
      _log('views.StagePage: initialize', app.LOG_DEBUG);

      this.render();
      this.appendBackButtonListeners();
    },

    render: function () {
      this.$el.html(this.template());

      this.listenTo(this.model,
        'change:' + this.warehouse_id, this.update);

      $('body').append($(this.el));
      return this;
    },

    update: function () {
      var value = this.model.get(this.warehouse_id);
      if (!value) {
        //unset all radio buttons
        this.$el.find("input:radio").attr("checked", false).checkboxradio("refresh");
      }
    },

    save: function (e) {
      var name = this.warehouse_id;
      var value = e.currentTarget.value;
      if (value !== "") {
        this.model.set(name, value);
      }
      window.history.back();
    }
  });

  return StagePage;
});