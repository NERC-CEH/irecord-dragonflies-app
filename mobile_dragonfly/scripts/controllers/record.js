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
            app.image.setImage('input[type="file"]', '#sample-image');
            this.addRecordValidation();

            //assigns the record submit button handler to use submitStart()
            $("#entry-form-submit").click(app.record.submit);

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