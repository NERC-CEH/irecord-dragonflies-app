/**
 * Created by karkaz on 20/08/14.
 */
(function($){
    app.controller = app.controller || {};
    app.controller.user = {
        pagecontainershow: function(){
            this.printUserControls();
            this.printList();
        },

        sendAllSavedRecords: function(){
            app.io.sendAllSavedRecords();
        },

        sendSavedRecord: function(recordStorageId){
            if (navigator.onLine) {
                $.mobile.loading('show');

                function onSuccess(){
                    $.mobile.loading( 'show', {
                        text: "Done!",
                        theme: "b",
                        textVisible: true,
                        textonly: true
                    });

                    setTimeout(function(){
                        $.mobile.loading('hide');
                    }, 3000);

                    app.record.storage.remove(recordStorageId);
                    app.controller.user.printList();
                }

                function onError (xhr, ajaxOptions, thrownError) {
                        _log("SEND - record ajax (ERROR "  + xhr.status+ " " + thrownError +")");
                        _log(xhr.responseText);

                        $.mobile.loading( 'show', {
                            text: xhr.responseText.replace(/<br\/>/g, ' '),
                            theme: "b",
                            textVisible: true,
                            textonly: true
                        });

                        setTimeout(function(){
                            $.mobile.loading('hide');
                        }, 10000);
                    }

                app.io.sendSavedRecord(recordStorageId, onSuccess, onError);
            } else {
                $.mobile.loading( 'show', {
                    text: "Looks like you are offline!",
                    theme: "b",
                    textVisible: true,
                    textonly: true
                });

                setTimeout(function(){
                    $.mobile.loading('hide');
                }, 3000);
            }
        },

        deleteSavedRecord: function(recordStorageId){
            app.record.storage.remove(recordStorageId);
            this.printList();
        },

        printUserControls: function(){
            var template = $('#user-template').html();
            var placeholder = $('#user-placeholder');

            var compiled_template = Handlebars.compile(template);

            var user = {
                'loggedout': !app.controller.login.getLoginState()
            };
            placeholder.html(compiled_template({'user': user}));
            placeholder.trigger('create');
        },

        printList: function(){
            var savedRecords = app.record.storage.getAll();
            var keys = Object.keys(savedRecords);
            var records = [];
            for(var i = 0; i < keys.length; i++){
                var data = {};
                for(var j = 0; j < savedRecords[keys[i]].length; j++){
                    var name = savedRecords[keys[i]][j].name;
                    var value = savedRecords[keys[i]][j].value;
                    switch (name) {
                        case app.record.inputs.KEYS.DATE:
                            name = 'date';
                            break;
                        case app.record.inputs.KEYS.TAXON:
                            var species = app.data.species;
                            for(var k = 0; k < species.length; k++){
                                if(species[k].warehouse_id == value){
                                    name = 'common_name';
                                    value = species[k].common_name;
                                     break;
                                }
                            }
                            break;
                        default:
                    }
                    data[name] = value;

                }
                records.push({
                        'id': keys[i],
                        'data' : data
                    }
                );
            }

            var template = $('#saved-list-template').html();
            var placeholder = $('#saved-list-placeholder');

            var compiled_template = Handlebars.compile(template);

            placeholder.html(compiled_template({'records': records}));
            placeholder.trigger('create');
        }
    };

    $(document).on('app.record.sentall.success', function(e){
        app.controller.user.printList();
    });

}(jQuery));