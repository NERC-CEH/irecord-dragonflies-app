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
            this.addRecordValidation();

            //Current record setup and attaching listeners to record inputs
            app.record.clear();
            app.geoloc.run();

            this.saveSpecies();
            this.saveDate();

            var ele = document.getElementById('occAttr:223');
            $(ele).change(function(){
                var checked = $(this).prop('checked');
                app.record.inputs.set('occAttr:223', checked);
            });
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

        /**
         * Sets up specific validation for the record.
         */
        addRecordValidation: function(){
            //overwrite default validator
            app.record.validate = function(){
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
                        'name': 'Date'
                    })
                }
                if(!app.record.inputs.is('occurrence:taxa_taxon_list_id')){
                    invalids.push({
                        'id': 'occurrence:taxa_taxon_list_id',
                        'name': 'Date'
                    })
                }
                return invalids;
            }
        },

        /*
         * Starts the record submission process.
         */
        submit: function(recordId) {
            _log("DEBUG: SUBMIT - start");
            var processed = false;
            $(document).trigger('app.submitRecord.start');
            //validate record
            var invalids = app.record.validate(recordId);
            if(invalids.length == 0){
                //validate GPS lock
                var gps = app.geoloc.validate();
                switch(gps){
                    case app.TRUE:
                        _log("DEBUG: GPS Validation - accuracy Good Enough");
                        processed = true;
                        this.process();
                        break;
                    case app.FALSE:
                        _log("DEBUG: GPS Validation - accuracy " );
                        $(document).trigger('app.geoloc.lock.bad');
                        break;
                    case app.ERROR:
                        _log("DEBUG: GPS Validation - accuracy -1");
                        $(document).trigger('app.geoloc.lock.no');
                        break;
                    default:
                        _log('DEBUG: GPS validation unknown');
                }
            } else {
                jQuery(document).trigger('app.record.invalid', [invalids]);
            }
            $(document).trigger('app.submitRecord.end', [processed]);
        },

        /**
         * Processes the record either by saving it and sending (online) or simply saving (offline).
         */
        process: function(callback){
            if (navigator.onLine) {
                this.processOnline(callback);
            } else {
                this.processOffline(callback)
            }
        },

        /**
         * Saves and submits the record.
         */
        processOnline: function(callback){
            _log("DEBUG: SUBMIT - online");
            var onSaveSuccess = function(savedRecordId){
                app.record.clear();
                //#2 Post the record
                app.io.sendSavedRecord(savedRecordId, callback);
            };
            //#1 Save the record first
            app.record.db.save(onSaveSuccess);
        },

        /**
         * Saves the record.
         */
        processOffline: function(callback){
            _log("DEBUG: SUBMIT - offline");
            $.mobile.loading('show');
            app.record.db.save(callback);
            // if (app.record.db.saveUsingRecordId('#entry_record') > 0){
            //if ( > 0){
            //    $(document).trigger('app.submitRecord.save');
            //} else {
            //    $(document).trigger('app.submitRecord.error');
            //}
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


    //ADD ONLY ON SUBMIT START
    $(document).on('app.submitRecord.start', function(e){
        $.mobile.loading('show');
    });

    $(document).on('app.record.sent.success', function(e){
        $.mobile.loading('hide');
        app.navigation.popup("<center><h2>Submitted successfully. </br>Thank You!</h2></center>", false);
        app.navigation.go(4000, 'list');
    });

    $(document).on('app.record.sent.error', function(e, xhr, thrownError){
        $.mobile.loading('hide');
        var message = "<center><h3>Sorry!</h3></center>" +
            "<p>" + xhr.status+ " " + thrownError + "</p><p>" + xhr.responseText + "</p>";
        app.navigation.makePopup(message, true);
        $('#app-popup').popup().popup('open');
    });

    $(document).on('app.record.invalid', function(e, invalids){
        var message = " <center><h3>Validation</h3></center>" +
            " <p>The following is still missing:</p><ul>";

        for (var i=0; i < invalids.length; i++)
            if (invalids[i].name.indexOf(app.record.MULTIPLE_GROUP_KEY) != 0){
                message += "<li>" + $("label[for='" + invalids[i].id + "']").text() + "</li>";
            } else {
                message += "<li>" + $("label[data-for='" + invalids[i].id + "']").text() + "</li>";
            }

        message += "</ul>";
        $.mobile.loading('hide');
        app.navigation.popup(message, true);
    });

    $(document).on('app.submitRecord.save', function(e){
        $.mobile.loading('hide');
        app.navigation.popup("<center><h2>No Internet. Record saved.</h2></center>", false);
        app.navigation.go(4000, 'list');
    });

}(jQuery));