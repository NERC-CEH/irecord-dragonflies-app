/**
 * Created by karkaz on 20/08/14.
 */
(function($){
    app.controller = app.controller || {};
    app.controller.record = {
        /**
         * Setting up a recording page.
         */
        pagecreate : function(){
            _log('Initialising: recording page');
            this.setImage('input[type="file"]', '#sample-image');

            //Current record setup and attaching listeners to record inputs
            app.record.clear();

            function onGeolocSuccess(location){
                app.controller.record.saveSref(location);
            }
            app.geoloc.run(onGeolocSuccess);

            this.saveSpecies();
            this.saveDate();

            var ele = document.getElementById('occAttr:223');
            $(ele).change(function(){
                var checked = $(this).prop('checked');
                app.record.inputs.set('occAttr:223', checked);
            });
        },

        /*
         * Validates and sends the record. Saves it if no network.
         */
        send: function() {
            $.mobile.loading('show');

            if (!this.valid()){
                $.mobile.loading('hide');
                return;
            }

            function onError(err){
                $.mobile.loading('hide');
                var message = "<center><h3>Sorry!</h3></center>" +
                    "<p>" + err.message + "</p>";
                app.navigation.makePopup(message, true);
                $('#app-popup').popup().popup('open');
            }

            if (navigator.onLine) {
                //online
                function onOnlineSuccess(){
                    $.mobile.loading('hide');
                    app.navigation.popup("<center><h2>Submitted successfully. </br>Thank You!</h2></center>", false);
                    app.navigation.go(4000, 'list');
                }
                this.processOnline(onOnlineSuccess, onError);
            } else {
                //offline
                function onSaveSuccess(){
                    $.mobile.loading('hide');
                    app.navigation.popup("<center><h2>No Internet. Record saved.</h2></center>", false);
                    app.navigation.go(4000, 'list');
                }
                this.processOffline(onSaveSuccess, onError)
            }
        },

        /*
         * Validates and saves the record.
         */
        save: function() {
            $.mobile.loading('show');

            if (!this.valid()){
                $.mobile.loading('hide');
                return;
            }

            function onSuccess(){
                $.mobile.loading('hide');
                app.navigation.popup("<center><h2>Record saved.</h2></center>", false);
                app.navigation.go(4000, 'list');
            }
            function onError(err){
                $.mobile.loading('hide');
                var message = "<center><h3>Sorry!</h3></center>" +
                    "<p>" + err.message +  "</p>";
                //xhr.status+ " " + thrownError + "</p><p>" + xhr.responseText +
                app.navigation.makePopup(message, true);
                $('#app-popup').popup().popup('open');
            }

            this.processOffline(onSuccess, onError);
        },

        /**
         * Saves and submits the record.
         */
        processOnline: function(callback, onError){
            _log("DEBUG: SUBMIT - online");
            var onSaveSuccess = function(savedRecordId){
                app.record.clear();

                function onSendSuccess(){
                    app.record.db.remove(savedRecordId);
                    if (callback != null){
                        callback();
                    }
                }
                //#2 Post the record
                app.io.sendSavedRecord(savedRecordId, onSendSuccess, onError);
            };
            //#1 Save the record first
            app.record.db.save(onSaveSuccess, onError);
        },

        /**
         * Saves the record.
         */
        processOffline: function(callback, onError){
            _log("DEBUG: SUBMIT - offline");
            var onSaveSuccess = function(savedRecordId){
                app.record.clear();

                if (callback != null){
                    callback();
                }
            };
            app.record.db.save(onSaveSuccess, onError);
        },

        /**
         * Validates the record and GPS lock. If not valid then
         * takes some action - popup/gps page redirect.
         * @returns {*}
         */
        valid: function(){
            //validate record
            var invalids = this.validateInputs();
            if (invalids.length > 0) {
                var message =
                    " <p>The following is still missing:</p><ul>";

                for (var i=0; i < invalids.length; i++){
                    message += "<li>" + invalids[i].name + "</li>";
                }

                message += "</ul>";
                app.navigation.popup(message, true);
                return app.FALSE;
            }

            //validate gps
            var gps = app.geoloc.valid();
            if (gps == app.ERROR || gps == app.FALSE){
                //redirect to gps page
                $('#sref-top-button').click();
                return app.FALSE;
            }
            return app.TRUE;
        },

        /**
         * Validates the record inputs.
         */
        validateInputs: function(){
            var invalids = [];

            if(!app.record.inputs.is('sample:date')){
                invalids.push({
                    'id': 'sample:date',
                    'name': 'Date'
                })
            }
            if(!app.record.inputs.is('sample:entered_sref')){
                invalids.push({
                    'id': 'sample:entered_sref',
                    'name': 'Location'
                })
            }
            if(!app.record.inputs.is('occurrence:taxa_taxon_list_id')){
                invalids.push({
                    'id': 'occurrence:taxa_taxon_list_id',
                    'name': 'Species'
                })
            }
            return invalids;
        },

        saveSref : function(location){
            if (location == null){
                return app.ERROR;
            }
            var sref = location.lat + ', ' + location.lon;
            var sref_system = "4326";
            var sref_accuracy = location.acc;
            app.record.inputs.set(app.record.inputs.KEYS.SREF, sref);
            app.record.inputs.set(app.record.inputs.KEYS.SREF_SYSTEM, sref_system);
            app.record.inputs.set(app.record.inputs.KEYS.SREF_ACCURACY, sref_accuracy);
        },

        /**
         * Saves the user comment into current record.
         */
        saveInput: function(name){
            if (name == null && name == ""){
                _log('Error, no input name provided.');
                return app.ERROR;
            }
            var ele = document.getElementById(name);
            var value = $(ele).val();
            if (value != "") {
                app.record.inputs.set(name, value);
            }
        },

        /**
         * Saves the selected species into current record.
         */
        saveSpecies: function(){
            var specie = app.controller.list.getCurrentSpecies();
            if (specie != null && specie.warehouse_id != null && specie.warehouse_id != ""){
                var name = 'occurrence:taxa_taxon_list_id';
                var value = specie.warehouse_id;
                app.record.inputs.set(name, value);

                //add header to the page
                $('#record_heading').text(specie.common_name);
            } else {
                _log('Error, no species was found. Nothing attached to the recording.');
            }
        },

        /**
         * Saves the current date and populates the date input.
         */
        saveDate: function(){
            var now = new Date();
            var day = ("0" + now.getDate()).slice(-2);
            var month = ("0" + (now.getMonth() + 1)).slice(-2);

            var value = now.getFullYear()+"-"+(month)+"-"+(day) ;
            var name = 'sample:date';

            var ele = document.getElementById(name);
            $(ele).val(value);

            app.record.inputs.set(name, value);
        },

        setImage: function(input, output){
            var img_holder = 'sample-image-placeholder';
            var upload = $(input);

            if (typeof window.FileReader === 'undefined') {
                return false;
            }

            // upload.before(sample_tmpl);
            $('#photo').append('<div id="' + img_holder + '"></div>');

            $('#' + img_holder).on('click', function(){
                upload.click();
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
                    $('#' + img_holder).css('border', '0px');
                    //$('#' + img_holder).css('background-color', 'transparent');
                    $('#' + img_holder).css('background-image', 'none');
                };
                reader.readAsDataURL(file);

                return false;
            });
        }
    };

}(jQuery));