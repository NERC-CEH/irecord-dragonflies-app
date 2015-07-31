/******************************************************************************
 * Record page view.
 *****************************************************************************/
define([
    'views/_page',
    'morel',
    'views/contact_details_dialog',
    'templates',
    'conf'
], function (DefaultPage, morel, contactDetailsDialog) {
    'use strict';

    var Page = DefaultPage.extend({
        id: 'record',

        template: app.templates.p_record,

        events: {
            'click #entry-form-save': 'save',
            'change input[type="checkbox"]': 'saveCertain',
            'click #photo': function (event) {
                $('input[type="file"]').trigger('click');
            }
        },

        initialize: function () {
            _log('views.RecordPage: initialize', log.DEBUG);

            this.render();
            this.appendEventListeners();
            this.trip();
        },

        render: function () {
            _log('views.RecordPage: render', log.DEBUG);

            this.$el.html(this.template());
            $('body').append($(this.el));

            this.$heading = this.$el.find('#record_species');
            this.$certainInputLabel = this.$el.find('#certain-button-label');
            this.$certainInput = this.$el.find('#certain-button');
            this.$photo = this.$el.find('#photo');
            this.$locationButton = this.$el.find('#location-button');
            this.$numberButton = this.$el.find('#number-button .descript');
            this.$stageButton = this.$el.find('#stage-button .descript');
            this.$commentButton = this.$el.find('#comment-button .descript');
            this.$dateButton = this.$el.find('#date-button .descript');
            return this;
        },

        update: function (prevPageId, speciesID) {
            _log('views.RecordPage: update.', log.DEBUG);
            switch (prevPageId) {
                case 'list':
                case 'species':
                    this.initRecording(speciesID);
                    break;
                case '':
                    _log('views.RecordPage: coming from unknown page.', log.WARNING);
                    this.initRecording(speciesID);
                default:
            }
        },

        appendEventListeners: function () {
            this.appendBackButtonListeners();
        },

        appendSampleListeners: function () {
            this.model.on('change:comment', this.updateCommentButton, this);
            this.model.on('change:location_accuracy', this.updateGPSButton, this);
            this.model.on('change:location', this.updateGPSButton, this);
            this.model.on('change:date', this.updateDateButton, this);
        },

        appendOccurrenceListeners: function () {
            this.occurrence.on('change:number', this.updateNumberButton, this);
            this.occurrence.on('change:stage', this.updateStageButton, this);
        },

        /**
         * Initialises the recording form: sets empty image, clears geolocation etc.
         */
        initRecording: function (speciesID) {
            var specie = app.collections.species.find({id: speciesID});
            this.occurrence = new morel.Occurrence({
                attributes: {
                    'taxon': specie.attributes.warehouse_id
                }
            });

            this.model = new morel.Sample({
                occurrences: [this.occurrence]
            });

            app.models.sample = this.model; //needs to be globally accessible

            this.appendSampleListeners();
            this.appendOccurrenceListeners();

            //add header to the page
            this.$heading.text(specie.attributes.common_name);
            this.resetButtons();

            //turn off certainty option on general ones
            if (specie.attributes.general) {
                this.$certainInputLabel.hide();
                this.$certainInput.hide();
            } else {
                this.$certainInputLabel.show();
                this.$certainInput.show();
            }

            //start geolocation
            this.runGeoloc();

            this.setImage('input[type="file"]');
            this.updateDateButton(); //morel sets date automatically, before listeners are attached
        },

        /**
         * Runs geolocation service in the background and updates the record on success.
         */
        runGeoloc: function () {
            function onGeolocSuccess(location) {
                _log('views.RecordPage: saving location.', log.DEBUG);
                morel.geoloc.set(location.lat, location.lon, location.acc);

                var sref = location.lat + ', ' + location.lon;
                app.models.sample.set('location', sref);
                app.models.sample.set('location_accuracy', location.acc);
            }

            function onError(err) {
                //modify the UI
                app.models.sample.set('location_accuracy', -1); //stopped
            }

            morel.geoloc.run(null, onGeolocSuccess, onError);
            this.model.set('location_accuracy', 0); //running
        },

        /**
         * Saves the record.
         */
        save: function () {
            _log('views.RecordPage: saving record.', log.DEBUG);
            $.mobile.loading('show');

            if (!this.valid()) {
                return;
            }

            function callback(err) {
                if (err) {
                    var message = "<center><h2>Error</h2></center>" +
                        "<p>" + err.message + "</p>";
                    app.message(message);
                    return;
                }

                morel.geoloc.clear();

                app.message("<center><h2>Record saved.</h2></center>");
                setTimeout(function () {
                    Backbone.history.navigate('list', {trigger: true});
                }, 2000);
            }

            app.recordManager.set(this.model, callback);
        },

        /**
         * Sets the user selected species image as a background of the image picker.
         *
         * @param input
         * @returns {boolean}
         */
        setImage: function (input) {
            var img_holder = 'sample-image-placeholder';
            var upload = $(input);

            if (!window.FileReader) {
                return false;
            }

            $('#' + img_holder).remove();
            this.$photo.append('<div id="' + img_holder + '" class="camera-picker"></div>');

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
                Backbone.history.navigate('location', {trigger: true});
                return morel.FALSE;
            }

            //validate the rest
            var invalids = this._validate();
            if (invalids) {
                var message =
                    "<h2>Still missing:</h2><ul>";

                for (var i = 0; i < invalids.length; i++) {
                    message += "<li>" + invalids[i] + "</li>";
                }

                message += "</ul>";
                app.message(message);
                return morel.FALSE;
            }

            return morel.TRUE;
        },

        /**
         * Validates the record inputs.
         */
        _validate: function (attrs, options) {
            var invalids = [];

            if (!this.model.has('date')) {
                invalids.push('Date');
            } else {
                //check if valid date
                var input = this.model.get('date').split('/');
                var inputDate = new Date(parseInt(input[2]), parseInt(input[1]) - 1, parseInt(input[0]));
                var currentDate =  new Date();
                if (inputDate > currentDate) {
                    invalids.push('Non future Date');
                }
            }

            if (!this.model.has('location')) {
                invalids.push('Location');
            }
            if (!this.occurrence.has('taxon')) {
                invalids.push('Taxon');
            }
            return invalids.length > 0 ? invalids : null;
        },

        /**
         * Udates the GPS button with the traffic light indication showing GPS status.
         */
        updateGPSButton: function () {
            var text = '';

            var accuracy = this.model.get('location_accuracy');
            switch (true) {
                case (accuracy == -1 || accuracy === 'undefined'):
                    //none
                    this.$locationButton.addClass('none');
                    this.$locationButton.removeClass('done');
                    this.$locationButton.removeClass('running');

                    text = 'Required';
                    break;
                case (accuracy > 0):
                    //done
                    this.$locationButton.addClass('done');
                    this.$locationButton.removeClass('running');
                    this.$locationButton.removeClass('none');

                    var value = this.model.get('location');
                    var location = {
                        latitude: value.split(',')[0],
                        longitude: value.split(',')[1]
                    };
                    var p = new LatLon(location.latitude, location.longitude, LatLon.datum.WGS84);
                    var grid = OsGridRef.latLonToOsGrid(p);
                    text = grid.toString();
                    break;
                case (accuracy == 0):
                    //running
                    this.$locationButton.addClass('running');
                    this.$locationButton.removeClass('done');
                    this.$locationButton.removeClass('none');

                    text = 'Locating..';
                    break;
                default:
                    _log('views.RecordPage: ERROR no such GPS button state: ' + accuracy, log.WARNING);
            }

            this.$locationButton.find('.descript').html(text);
        },

        updateDateButton: function () {
            var value = this.model.get('date');
            var text = value || '';
            this.$dateButton.html(text);
        },

        /**
         * Resets the record page buttons to initial state.
         */
        resetButtons: function () {
            this.updateNumberButton();
            this.updateStageButton();
            this.updateCommentButton();

            this.$certainInput.prop('checked', true).checkboxradio('refresh');
        },

        /**
         * Updates the button info text.
         */
        updateNumberButton: function () {
            var value = this.occurrence.get('number');
            var text = '';
            var keys = Object.keys(morel.Occurrence.KEYS.NUMBER.values);
            for (var i = 0; i < keys.length; i++) {
                if (morel.Occurrence.KEYS.NUMBER.values[keys[i]] === value) {
                    text = keys[i];
                    break;
                }
            }
            this.$numberButton.html(text);
        },

        /**
         * Updates the button info text.
         */
        updateStageButton: function () {
            var value = this.occurrence.get('stage');
            var text = '';
            var keys = Object.keys(morel.Occurrence.KEYS.STAGE.values);
            for (var i = 0; i < keys.length; i++) {
                if (morel.Occurrence.KEYS.STAGE.values[keys[i]] === value) {
                    text = keys[i];
                    break;
                }
            }
            this.$stageButton.html(text);
        },

        /**
         * Updates the button info text.
         */
        updateCommentButton: function () {
            var value = this.model.get('comment');
            var ellipsis = value && value.length > 20 ? '...' : '';
            value = value ? value.substring(0, 20) + ellipsis : ''; //cut it down a bit
            this.$commentButton.html(value);
        },

        /**
         * Shows the user around the page.
         */
        trip: function () {
            var finishedTrips = app.models.user.get('trips') || [];
            if (finishedTrips.indexOf('record') < 0) {
                finishedTrips.push('record');
                app.models.user.set('trips', finishedTrips);
                app.models.user.save();

                setTimeout(function () {
                    trip.start();
                }, 500);
            }

            var options = {
                delay: 1500
            };

            var trip = new Trip([
                {
                    sel: $('#photo-picker'),
                    position: "s",
                    content: 'Snap a picture',
                    animation: 'fadeIn'
                },
                {
                    sel: $('#number-button'),
                    position: "s",
                    content: 'Fill in the details',
                    animation: 'fadeIn'
                },
                {
                    sel: $('#entry-form-save'),
                    position: "n",
                    content: 'Save it',
                    animation: 'fadeIn'
                }
            ], options);
        }
    });

    return Page;
});

