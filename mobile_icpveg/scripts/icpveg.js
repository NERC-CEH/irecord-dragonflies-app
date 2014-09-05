//APP CACHE DEBUGGING
// log each of the events fired by window.applicationCache
window.applicationCache.onchecking = function(e) {
    console.log("CACHE: Checking for updates");
};
window.applicationCache.onnoupdate = function(e) {
    console.log("CACHE: No updates");
};
window.applicationCache.onupdateready = function(e) {
    console.log("CACHE: Update ready");
};
window.applicationCache.onobsolete = function(e) {
    console.log("CACHE: Obsolete");
};
window.applicationCache.ondownloading = function(e) {
    makeLoader("<h1>Downloading the app</h1>", 3000);
    console.log("CACHE: Downloading");
};
window.applicationCache.oncached = function(e) {
    makeLoader("<h1>App is available offline</h1>", 3000);
    console.log("CACHE: Cached - available offline");
};
window.applicationCache.onerror = function(e) {
    console.log("CACHE: Error");
};
// END APP CACHE DEBUGGING

(function($){
    app.PATH = "/drupal/app/";

    app.icpveg = {
        updateFormCounter : function() {
            _log(" Updating form counter");
            var count = localStorage.getItem("form_count");

            // This updates a counter on a send form dialog.
            // The dialog is created as a node in Drupal.
            // It contains the content:
            // <center>
            //   <h2>You have: <span id="savedFormCounter">0</span>
            //     <span id="savedFormCounterWording"> forms</span> to send.
            //   </h2>
            // </center>
            var formCounter = $("#savedFormCounter");
            formCounter.fadeOut(200);
            formCounter.text(count);
            formCounter.fadeIn(200);
            jQuery("#savedFormCounterWording").text(((count == 1) ? " form" : " forms"));

            // This updates a counter on a home page menu item.
            // This home page is created as a node in Drupal
            // It contains the content:
            // <li class="a-savedFormCounter" data-theme="b" style="display:none">
            //   <a href="/drupal/app/send-forms-dialog" onclick="updateFormCounter()"   data-prefetch>
            //     <i>Saved forms:</i><span class="savedFormCounter">0</span>
            //   </a>
            // </li>
            $(".savedFormCounter").text(count);
            // The home page menu item is hidden if there are no saved forms.
            if (count != null && count != 0) {
                $(".a-savedFormCounter").css("display", "");
            } else {
                $(".a-savedFormCounter").css("display", "none");
            }
        }
    };

    /*###########
     ## EVENTS ##
     ###########*/
    $(document).on('app.form.sentall.success', function(e){
        app.icpveg.updateFormCounter();
    });

    //ADD ONLY ON SUBMIT START
    $(document).on('app.submitRecord.start', function(e){
        $.mobile.loading('show');

        $(document).on('app.geoloc.lock.start app.form.sent.start', function(e){
            $.mobile.loading('show');
        });

        $(document).on('app.submitRecord.save', function(e){
            $.mobile.loading('hide');
            app.icpveg.updateFormCounter();
            app.navigation.popup("<center><h2>No Internet. Form saved.</h2></center>", false);
            app.navigation.go(4000, 'home');
        });

        $(document).on('app.submitRecord.error', function(e){
            $.mobile.loading('hide');
            var message = " <center><h2>Error.</h2></center>" +
                " <p>Full local storage. Please send the old forms first.</p>";

            app.navigation.popup(message, false);
            app.navigation.goRecord(4000);
        });

        $(document).on('app.form.invalid', function(e, invalids){
            var message = " <center><h3>Validation</h3></center>" +
                " <p>The following is still missing:</p><ul>";

            for (var i=0; i < invalids.length; i++)
                if (invalids[i].name.indexOf(app.form.MULTIPLE_GROUP_KEY) != 0)
                    message += "<li>" + $("label[for='" + invalids[i].id + "']").text() + "</li>";
                else
                    message += "<li>" + $("label[data-for='" + invalids[i].id + "']").text() + "</li>";

            message += "</ul>";
            $.mobile.loading('hide');
            app.navigation.popup(message, true);
        });

        $(document).on('app.form.sent.success', function(e){
            $.mobile.loading('hide');
            app.navigation.popup("<center><h2>Submitted successfully. </br>Thank You!</h2></center>", false);
            app.navigation.go(4000, 'home');
        });

        $(document).on('app.form.sent.error', function(e, xhr, thrownError){
            $.mobile.loading('hide');
            var message = "<center><h3>Sorry!</h3></center>" +
                "<p>" + xhr.status+ " " + thrownError + "</p><p>" + xhr.responseText + "</p>";
            app.navigation.makePopup(message, true);
            $('#app-popup').popup().popup('open');
        });

        $(document).on('app.geoloc.lock.no', function(){
            $.mobile.loading('hide');
            var tries = app.geoloc.tries;
            if (tries == 0 || tries == null){
                message = " <center><h3>GPS</h3></center>" +
                    " <p>Sorry, we couldn't get your location. Please make sure the GPS is on and try again.</p>"+
                    " <button onclick='app.geoloc.start(60000)' data-theme='a' class=' ui-btn ui-btn-a ui-shadow ui-corner-all'>Try again</button>";
                app.navigation.popup(message, true);

            } else if (tries == 5){
                message = " <center><h3>GPS</h3></center>" +
                    " <p>Hmm.. don't worry, some day you might just get lucky. </p>"+
                    " <button onclick='app.geoloc.start(60000)' data-theme='a' class=' ui-btn ui-btn-a ui-shadow ui-corner-all'>Try again</button>";
                app.navigation.popup(message, true);

            }else {
                message = " <center><h3>GPS</h3></center>" +
                    " <p>Still can't get your location. Make sure you are outside and move away from tall buildings, trees and try again.</p>"+
                    " <button onclick='app.geoloc.start(60000)' data-theme='a' class=' ui-btn ui-btn-a ui-shadow ui-corner-all'>Try again</button>";
                app.navigation.popup(message, true);

            }
            var popup = $('#app-popup');
            popup.popup({
                afterclose: function( event, ui ) {
                    _log("POPUP - closed");
                    jQuery.mobile.loading('hide');
                    navigator.geolocation.clearWatch(indiciaData.gps_running_id);
                }
            });
            popup.popup('open');
        });

        $(document).on('app.geoloc.lock.error ' +
            'app.geoloc.lock.timeout', function(){
                $.mobile.loading('hide');
                $('#app-popup').popup('close');
                app.submitRecord();
        } );

        $(document).on('app.geoloc.lock.ok', function(){
            $.mobile.loading('hide');
            $('#app-popup').popup('close');
            app.submitRecord();
        } );

        $(document).on('app.geoloc.noGPS', function(){
            var message = "<center><h3>Sorry!</h3></center>" +
                "<p>Geolocation is not supported by your browser</p>";

            app.navigation.popup(message, false);
        });
    });

    //GPS button popup
    app.navigation.gpsPopup = function (){
        var coords = $('#imp-sref').val();
        var accuracy = $('#sref_accuracy').val();
        if (accuracy == -1){
            app.navigation.popup('<center><h2>GPS</h2></center><h3></h3><h3><b>No Lock Yet</b></h3> ');
        }else{
            app.navigation.popup('<center><h2>GPS</h2></center><h3><b>Your coordinates:</b> ' + coords + '</h3><h3><b>Accuracy:</b> ' + accuracy + 'm</h3> ');
        }

    };

    /*##############
     ## START APP ##
     ##############*/

    app.DEBUG = true;
    app.initialise();
    $.mobile.defaultDialogTransition = "slide"; //old jQuery
    $.mobile.defaultPageTransition = "slide";
    /*########################
     ## PAGE SPECIFIC LOGIC ##
     ########################*/

    // $(document).ready will only trigger on a full page load,
    // not when Ajax loading a page
    // The recording form is never Ajax loaded as it contains multiple pages.
    $(document).ready(function() {
        //assigns the form submit button handler to use submitStart()
        $("#entry-form-submit").click(app.submitRecord);
    });

    $(document).on('pagecreate', '#app-home', function(event, ui) {
        //ios app mode a link fix
        //will fix all a tagged elements with the class 'ios-enhanced'
        $("a.ios-enhanced").click(function (event) {
            event.preventDefault();
            window.location = $(this).attr("href");
        });

        app.icpveg.updateFormCounter();
    });

    //todo: may be make automatic
    $(document).on('pagecreate', '#tab-location', function(event, ui) {
        var formPath = $('#entry_form').attr('action');
        if(formPath != undefined){
            app.settings('formPath', formPath);
        }
    });

    //START GPS
    $(document).on('pagecreate', '#tab-location', function(event, ui) {
        app.geoloc.run();
    });


}(app.$ || jQuery));

//saving for old references in
updateFormCounter = app.icpveg.updateFormCounter;
sendAllSavedForms = app.io.sendAllSavedForms;