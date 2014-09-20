/**
 * Created by karkaz on 20/08/14.
 */
(function($){
    app.controller = app.controller || {};
    app.controller.record = {
        pagecreate : function(){
            _log('Page Init');
            app.geoloc.run();
            var formPath = $('#entry_form').attr('action');
            if(formPath != undefined){
                app.settings('formPath', formPath);
            }

            app.image.setImage('input[type="file"]', '#sample-image');

            //assigns the form submit button handler to use submitStart()
            $("#entry-form-submit").click(app.submitRecord);

            var warehouse_id = app.controller.list.getCurrentSpecies().warehouse_id;
            if(warehouse_id != null && warehouse_id != ""){
                //Fix/clear URL for other pages
                //history.replaceState({ foo: "bar" }, "Page", "record");

                //todo: return if invalid or empty
                //select input option
                var option = $('option[value="' + warehouse_id + '"]');
                $(option).prop('selected', 'true');

                //add header to the page
                var name = $(option).text();
                $('#record_heading').text(name);
            }
        },

        pagecontainershow : function(type, match, ui, page){
            _log('Page Beforeshow');
        },

        saveSref : function(location){
            if (location == null){
                return app.ERROR;
            }
            var sref = $('#imp-sref');
            var accuracy = $('#sref_accuracy');
            if(sref.length > 0 ){
                sref.val(location.lat + ', ' + location.lon);
                accuracy.val(location.acc);
            }
        }
    };

    //ADD ONLY ON SUBMIT START
    $(document).on('app.submitRecord.start', function(e){
        $.mobile.loading('show');
    });

    $(document).on('app.form.sent.success', function(e){
        $.mobile.loading('hide');
        app.navigation.popup("<center><h2>Submitted successfully. </br>Thank You!</h2></center>", false);
        app.navigation.go(4000, 'list');
    });

    $(document).on('app.form.sent.error', function(e, xhr, thrownError){
        $.mobile.loading('hide');
        var message = "<center><h3>Sorry!</h3></center>" +
            "<p>" + xhr.status+ " " + thrownError + "</p><p>" + xhr.responseText + "</p>";
        app.navigation.makePopup(message, true);
        $('#app-popup').popup().popup('open');
    });

    $(document).on('app.form.invalid', function(e, invalids){
        var message = " <center><h3>Validation</h3></center>" +
            " <p>The following is still missing:</p><ul>";

        for (var i=0; i < invalids.length; i++)
            if (invalids[i].name.indexOf(app.form.MULTIPLE_GROUP_KEY) != 0){
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
        app.navigation.popup("<center><h2>No Internet. Form saved.</h2></center>", false);
        app.navigation.go(4000, 'list');
    });

}(jQuery));