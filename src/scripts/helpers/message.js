/******************************************************************************
 * Displays a self disappearing lightweight message.
 *****************************************************************************/
define(['jquery', 'jquery.mobile'], function ($, jqm) {
    /**
     *
     * @param text
     * @param time 0 if no hiding, null gives default 3000ms delay
     * @constructor
     */
    var Message = function (text, time, close) {
        var CLOSE_ID = 'loader-close',
            CLOSE_HTML = '<div id="' + CLOSE_ID + '" class="ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext ui-btn-right"></div>';

        if (!text) {
            _log('NAVIGATION: no text provided to message.', log.ERROR);
            return;
        }

        var messageId = 'loaderMessage';
        var html = '<div id="' + messageId + '">' + (close ? CLOSE_HTML : '') + text + '</div>';

        $.mobile.loading('show', {
            theme: "b",
            textVisible: true,
            textonly: true,
            html: html
        });

        //trigger JQM beauty
        $('#' + messageId).trigger('create');

        $('#' + CLOSE_ID).on('click', function () {
            $.mobile.loading('hide');
        });

        if (time !== 0) {
            setTimeout(function () {
                $.mobile.loading('hide');
            }, time || 3000);
        }
    };

    app.message = Message;
});
