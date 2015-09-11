/******************************************************************************
 * Gallery.
 *****************************************************************************/
define(['photoswipe'], function (PhotoSwipe) {
    "use strict";

    /**
     * Initializes the species gallery.
     */
    var Gallery =  function (species) {
        var images = [],
            img = {},
            gallery = species.get('gallery'),
            gallery_authors = species.get('gallery_authors'),
            gallery_sex = species.get('gallery_sex'),
            profile_pic_sex = species.get('profile_pic_sex'),
            profile_pic_author = species.get('profile_pic_author');

        //build image array
        img = image(species.get('profile_pic'), profile_pic_author, profile_pic_sex);
        images.push(img);
        for (var i = 0; i < gallery.length; i++) {
            img = image(gallery[i], gallery_authors[i], gallery_sex[i]);
            images.push(img);
        }

        function image (url, author, sex) {
            return {
                url: url,
                caption: sex + '  Ⓒ ' + author
            };
        }

        return PhotoSwipe.attach(images,
            {
                jQueryMobile: true,
                preventSlideshow: true,
                allowUserZoom: true,
                loop: true,
                captionAndToolbarAutoHideDelay: 0,
                enableMouseWheel: true,
                enableKeyboard: true,

                preventHide: false,
                getImageSource: function(obj){
                    return obj.url;
                },
                getImageCaption: function(obj){
                    return obj.caption;
                }
            }
        );
    };

    return Gallery;
});


