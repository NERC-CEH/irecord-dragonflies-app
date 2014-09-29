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

        sendAllSavedForms: function(){
            app.io.sendAllSavedForms();
        },

        sendSavedForm: function(formStorageId){
            if (navigator.onLine) {
                $.mobile.loading('show');

                function onSuccess(){
                    $.mobile.loading('hide');
                    app.form.removeSaved(formStorageId);
                    app.controller.user.printList();
                }

                function onError(){
                    $.mobile.loading('hide');
                }

                app.io.sendSavedForm(formStorageId, onSuccess, onError);
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

        deleteSavedForm: function(formStorageId){
            app.form.storage.remove(formStorageId);
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
            var savedForms = app.form.storage.getAll();
            var keys = Object.keys(savedForms);
            var forms = [];
            for(var i = 0; i < keys.length; i++){
                var data = {};
                for(var j = 0; j < savedForms[keys[i]].length; j++){
                    var name = savedForms[keys[i]][j].name;
                    var value = savedForms[keys[i]][j].value;
                    switch (name) {
                        case app.form.inputs.KEYS.DATE:
                            name = 'date';
                            break;
                        case app.form.inputs.KEYS.TAXON:
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
                forms.push({
                        'id': keys[i],
                        'data' : data
                    }
                );
            }

            var template = $('#saved-list-template').html();
            var placeholder = $('#saved-list-placeholder');

            var compiled_template = Handlebars.compile(template);

            placeholder.html(compiled_template({'forms': forms}));
            placeholder.trigger('create');
        }
    };

    $(document).on('app.form.sentall.success', function(e){
        app.controller.user.printList();
    });

}(jQuery));