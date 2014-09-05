(function($){
    app.controller = app.controller || {};
    app.controller.species = {
        pagecreate: function(){

        },

        pagecontainershow: function(event, ui){
            _log('Species init');
            //var id = app.controller.list.getCurrentSpecies().id;

            var template = $('#species-template').html();
            var placeholder = $('#species-placeholder');

            var compiled_template = Handlebars.compile(template);

            var species = app.controller.list.getCurrentSpecies();

            //check for the favourite
            var favourites = app.controller.list.getFavourites();
            if (favourites[species.id] != null){
                species.favourite = "checked";
            } else {
                species.favourite = "";
            }

            placeholder.html(compiled_template(species));
            placeholder.trigger('create');

            $("#favourite-species-button").on( "change", function () {
                var species = app.controller.list.getCurrentSpecies();
                app.controller.list.changeFavourite(species.id, $(this).is(':checked'));
            });

            //app.controller.species.gallery.init($('.gallery').attr('id'));
        },

        /**
         *
         */
        gallery: {

            gallery : {},
            init : function(gallery_id){
                this.gallery =  $('#' + gallery_id + ' a').photoSwipe({
                    jQueryMobile: true,
                    loop: false,
                    enableMouseWheel: false,
                    enableKeyboard: false
                });
            },

            show : function(){
                this.gallery.show(0);
            }
        }
    };
}(jQuery));

