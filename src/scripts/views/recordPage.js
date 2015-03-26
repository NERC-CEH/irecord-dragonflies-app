define([
  'views/_page',
  'templates',
  'morel',
  'conf'
], function(Page) {
  'use strict';

  var RecordPage = Page.extend({
    id: 'record',

    template: app.templates.record,

    events: {
      'click #entry-form-save': 'save',
      'click #entry-form-send': 'send',
      'change input[type="checkbox"]': 'saveCertain'
    },

    initialize: function () {
      _log('views.RecordPage: initialize', log.DEBUG);

      this.listenTo(this.model,
        'change:' + morel.record.inputs.KEYS.NUMBER, this.updateNumberButton);
      this.listenTo(this.model,
        'change:' + morel.record.inputs.KEYS.STAGE, this.updateStageButton);
      this.listenTo(this.model,
        'change:' + morel.record.inputs.KEYS.LOCATIONDETAILS, this.updateLocationdetailsButton);
      this.listenTo(this.model,
        'change:' + morel.record.inputs.KEYS.COMMENT, this.updateCommentButton);

      this.listenTo(this.model,
        'change:' + morel.record.inputs.KEYS.SREF_ACCURACY, this.updateGPSButton);

      this.render();
      this.appendBackButtonListeners();
    },

    render: function () {
      _log('views.RecordPage: render', log.DEBUG);

      this.$el.html(this.template());
      $('body').append($(this.el));

      this.$heading = $('#record_heading');
      this.$certainInputLabel =  $('label[for="certain-button"]');
      this.$certainInput = $('#certain-button');
      this.$photo = $('#photo');
      this.$locationButton = $('#location-top-button');
      return this;
    },

    update: function (prevPageId, speciesID) {
      _log('views.RecordPage: update.');
      switch (prevPageId) {
        case 'list':
          this.initRecording(speciesID);
          break;
        case '':
          _log('views.RecordPage: coming from unknown page.', log.WARNING);
          this.initRecording(speciesID);
        default:
      }
    },

    /**
     * Initialises the recording form: sets empty image, clears geolocation etc.
     */
    initRecording: function (speciesID) {
      var specie = app.collections.species.find({id:speciesID});
      this.model.reset(specie.attributes.warehouse_id);

      //add header to the page
      this.$heading.text(specie.attributes.common_name);
      this.resetButtons();

      //turn off certainty option on general ones
      if (specie.attributes.general){
        this.$certainInputLabel.hide();
        this.$certainInput.hide();
      } else {
        this.$certainInputLabel.show();
        this.$certainInput.show();
      }

      //start geolocation
      this.runGeoloc();

      this.setImage('input[type="file"]');
    },

    runGeoloc: function () {
      function onGeolocSuccess(location) {
        _log('views.RecordPage: saving location.', log.DEBUG);
        morel.geoloc.set(location.lat, location.lon, location.acc);

        var sref = location.lat + ', ' + location.lon;
        app.views.recordPage.model.set(morel.record.inputs.KEYS.SREF, sref);
        app.views.recordPage.model.set(morel.record.inputs.KEYS.SREF_ACCURACY, location.acc);
      }
      function onError(err) {
        //modify the UI
        app.views.recordPage.model.set(morel.record.inputs.KEYS.SREF_ACCURACY, -1); //stopped
      }
      morel.geoloc.run(null, onGeolocSuccess, onError);
      this.model.set(morel.record.inputs.KEYS.SREF_ACCURACY, 0); //running
    },

    send: function () {
      _log('views.RecordPage: sending record.', log.INFO);

      $.mobile.loading('show');

      if (!this.valid()) {
        return;
      }

      if (navigator.onLine) {
        //online
        var onSendSuccess = function () {
          app.message("<center><h2>Submitted successfully. </br>Thank You!</h2></center>");
          setTimeout(function () {
            Backbone.history.navigate('list', {trigger:true});
          }, 2000);
        };

        switch (app.CONF.SEND_RECORD.STATUS) {
          case true:
            app.models.record.send(onSendSuccess, onError);
            break;
          case 'simulate':
            this.sendSimulate(onSendSuccess, onError);
            break;
          case false:
          default:
            _log('views.RecordPage: unknown feature state');
        }

      } else {
        //offline
        var onSaveSuccess = function () {
          app.views.listPage.updateUserPageButton();

          app.message("<center><h2>No Internet. Record saved.</h2></center>");
          setTimeout(function () {
            Backbone.history.navigate('list', {trigger:true});
          }, 2000);
        };
        app.models.record.save(onSaveSuccess, onError);
      }

      function onError(err) {
        app.views.listPage.updateUserPageButton();

        var message = "<center><h3>Sorry!</h3></center>" +
          "<p>" + err.message + "</p>" +
          "<p> Record Saved </p>";
        app.message(message);
        setTimeout(function () {
          Backbone.history.navigate('list', {trigger:true});
        }, 2000);
      }
    },

    /**
     * Simulates the login
     * @param form
     * @param person
     */
    sendSimulate: function (onSendSuccess, onError) {
      var selection =
        "<h1>Simulate:</h1>" +
        "<button id='simulate-success-button'>Success</button>" +
        "<button id='simulate-failure-button'>Failure</button>" +
        "<button id='simulate-cancel-button'>Cancel</button>";
      app.message(selection, 0);

      var that = this;
      $('#simulate-success-button').on('click', function () {
        onSendSuccess();
      });
      $('#simulate-failure-button').on('click', function () {
        app.models.record.save(function () {
          onError({message: 'Some Error Message.'});
        }, null);
      });
      $('#simulate-cancel-button').on('click', function () {
        $.mobile.loading('hide');
      });
    },

    save: function () {
      _log('views.RecordPage: saving record.', log.INFO);
      $.mobile.loading('show');

      if (!this.valid()) {
        return;
      }

      function onSuccess() {
        app.views.listPage.updateUserPageButton();

        app.message("<center><h2>Record saved.</h2></center>");
        setTimeout(function () {
          Backbone.history.navigate('list', {trigger:true});
        }, 2000);
      }

      function onError(err) {
        var message = "<center><h3>Sorry!</h3></center>" +
          "<p>" + err.message + "</p>";
        app.message(message);
      }

      app.models.record.save(onSuccess, onError);
    },

    setImage: function (input) {
      var img_holder = 'sample-image-placeholder';
      var upload = $(input);

      if (!window.FileReader) {
        return false;
      }

      $('#' + img_holder).remove();
      this.$photo.append('<div id="' + img_holder + '"></div>');

      $('#sample-image-placeholder').on('click', function () {
        $('input[type="file"]').click();
      });

      upload.change(function (e) {
        e.preventDefault();
        var file = this.files[0];
        var reader = new FileReader();

        reader.onload = function (event) {
          var img = new Image();
          img.src = event.target.result;
          // note: no onload required since we've got the dataurl...I think! :)
          if (img.width > 560) { // holder width
            img.width = 560;
          }
          $('#sample-image-placeholder').empty().append(img);
          var pic = $('#' + img_holder);
          pic.css('border', '0px');
          pic.css('background-image', 'none');
        };
        reader.readAsDataURL(file);

        return false;
      });
    },

    /**
     * Validates the record and GPS lock.
     *
     * @returns {*}
     */
    valid: function () {
      //validate gps
      var gps = morel.geoloc.valid();
      if (gps === morel.ERROR || gps === morel.FALSE) {
        //redirect to gps page
        Backbone.history.navigate('location', {trigger:true});
        return morel.FALSE;
      }

      //validate the rest
      var invalids = app.models.record.validate();
      if (invalids) {
        var message =
          "<h3>Still missing:</h3><ul>";

        for (var i = 0; i < invalids.length; i++) {
          message += "<li>" + invalids[i] + "</li>";
        }

        message += "</ul>";
        app.message(message);
        return morel.FALSE;
      }

      return morel.TRUE;
    },

    updateGPSButton: function () {
      var button = this.$locationButton;
      var accuracy = this.model.get(morel.record.inputs.KEYS.SREF_ACCURACY);
      switch (true) {
        case (accuracy == -1):
          //none
          button.addClass('none');
          button.removeClass('done');
          button.removeClass('running');
          break;
        case (accuracy > 0):
          //done
          button.addClass('done');
          button.removeClass('running');
          button.removeClass('none');
          break;
        case (accuracy == 0):
          //running
          button.addClass('running');
          button.removeClass('done');
          button.removeClass('none');
          break;
        default:
          _log('views.RecordPage: ERROR no such GPS button state: ' + accuracy, log.WARNING);
      }
    },

    saveCertain: function (e) {
      _log('app.views.RecordPage: saving certain.', log.INFO);
      var input = $(e.currentTarget).prop('checked');
      var value = input ? morel.record.inputs.KEYS.CERTAIN_VAL.TRUE :
        morel.record.inputs.KEYS.CERTAIN_VAL.FALSE;

      this.model.set(morel.record.inputs.KEYS.CERTAIN, value);
    },

    resetButtons: function () {
      this.updateNumberButton();
      this.updateStageButton();
      this.updateLocationdetailsButton();
      this.updateCommentButton();

      this.$certainInput.prop('checked', false).checkboxradio('refresh');
    },

    updateNumberButton: function () {
      var $numberButton = jQuery('#number-button .descript');
      var value = this.model.get(morel.record.inputs.KEYS.NUMBER);
      var text = '';
      var keys = Object.keys(morel.record.inputs.KEYS.NUMBER_VAL);
      for (var i = 0; i < keys.length; i++){
        if (morel.record.inputs.KEYS.NUMBER_VAL[keys[i]] === value) {
          text = keys[i];
          break;
        }
      }
      $numberButton.html(text);
    },

    updateStageButton: function () {
      var $stageButton = jQuery('#stage-button .descript');
      var value = this.model.get(morel.record.inputs.KEYS.STAGE);
      var text = '';
      var keys = Object.keys(morel.record.inputs.KEYS.STAGE_VAL);
      for (var i = 0; i < keys.length; i++){
        if (morel.record.inputs.KEYS.STAGE_VAL[keys[i]] === value) {
          text = keys[i];
          break;
        }
      }
      $stageButton.html(text);
    },

    updateLocationdetailsButton: function () {
      var $locationdetailsButton = jQuery('#locationdetails-button .descript');
      var value = this.model.get(morel.record.inputs.KEYS.LOCATIONDETAILS);
      value = value || '';
      $locationdetailsButton.html(value);
    },

    updateCommentButton: function () {
      var $commentButton = jQuery('#comment-button .descript');
      var value = this.model.get(morel.record.inputs.KEYS.COMMENT);
      value = value ? value.substring(0, 20) : ''; //cut it down a bit
      $commentButton.html(value);
    }
  });

  return RecordPage;
});

