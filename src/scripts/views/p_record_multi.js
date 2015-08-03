/******************************************************************************
 * Multi Record Info page view.
 *****************************************************************************/
define([
    'views/_page',
    'templates',
    'morel',
    'conf'
], function(DefaultPage) {
    'use strict';

    var Page = DefaultPage.extend({
        id: 'record-multi',

        template: app.templates.p_record_multi,

        initialize: function () {
            _log('views.RecordMultiPage: initialize', log.DEBUG);

            this.render();
            this.appendEventListeners();

            this.$locationButton = this.$el.find('#record-multi-location');
            this.$commentButton = this.$el.find('#record-multi-comment .descript');
            this.$dateButton = this.$el.find('#record-multi-date .descript');
        },

        render: function () {
            _log('views.RecordMultiPage: render', log.DEBUG);

            this.$el.html(this.template());
            $('body').append($(this.el));

            return this;
        },

        update: function (prevPageId) {
            _log('views.RecordMultiPage: update.', log.DEBUG);
            switch (prevPageId) {
                case 'list':
                    this.initRecording();
                    break;
                case '':
                    _log('views.RecordMultiPage: coming from unknown page.', log.WARNING);
                    this.initRecording();
                default:
            }
        },

        initRecording: function () {
            this.model = new morel.Sample();
            app.models.sampleMulti = this.model;

            this.model.on('change:comment', this.updateCommentButton, this);
            this.model.on('change:location_accuracy', this.updateGPSButton, this);
            this.model.on('change:location', this.updateGPSButton, this);
            this.model.on('change:date', this.updateDateButton, this);

            this.refreshButtons();

            this.runGeoloc();
        },

        /**
         * Runs geolocation service in the background and updates the record on success.
         */
        runGeoloc: function () {
            function onGeolocSuccess(location) {
                _log('views.RecordPage: saving location.', log.DEBUG);
                morel.geoloc.set(location.lat, location.lon, location.acc);

                var sref = location.lat + ', ' + location.lon;
                app.models.sampleMulti.set('location', sref);
                app.models.sampleMulti.set('location_accuracy', location.acc);
            }

            function onError(err) {
                //modify the UI
                app.models.sampleMulti.set('location_accuracy', -1); //stopped
            }

            morel.geoloc.run(null, onGeolocSuccess, onError);
            this.model.set('location_accuracy', 0); //running
        },

        appendEventListeners: function () {
            this.appendBackButtonListeners();
        },

        refreshButtons: function () {
            this.updateGPSButton();
            this.updateDateButton();
            this.updateCommentButton();
        },

        /**
         * Udates the GPS button with the traffic light indication showing GPS status.
         */
        updateGPSButton: function () {
            var text = '';

            var accuracy = this.model.get('location_accuracy');
            switch (true) {
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
                case (accuracy == -1):
                    //none
                    this.$locationButton.addClass('none');
                    this.$locationButton.removeClass('done');
                    this.$locationButton.removeClass('running');

                    text = 'Required';
                    break;
                default:
                    _log('views.RecordPage: ERROR no such GPS button state: ' + accuracy, log.WARNING);
                    //none
                    this.$locationButton.addClass('none');
                    this.$locationButton.removeClass('done');
                    this.$locationButton.removeClass('running');

                    text = 'Required';
            }

            this.$locationButton.find('.descript').html(text);
        },

        updateDateButton: function () {
            var value = this.model.get('date');
            var text = value || '';
            this.$dateButton.html(text);
        },

        /**
         * Updates the button info text.
         */
        updateCommentButton: function () {
            var value = this.model.get('comment');
            var ellipsis = value && value.length > 20 ? '...' : '';
            value = value ? value.substring(0, 20) + ellipsis : ''; //cut it down a bit
            this.$commentButton.html(value);
        }
    });

    return Page;
});

