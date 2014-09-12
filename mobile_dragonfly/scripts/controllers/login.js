/**
 * Created by karkaz on 20/08/14.
 */
(function($){
    app.controller = app.controller || {};
    app.controller.login = {
        //controller configuration should be set up in an app config file
        CONF: {
            APPNAME: "",
            APPSECRET: "",

            URL: "",
            TIMEOUT: 20000
        },

        pagecontainershow: function(){

        },

        /**
         * Starts an app sign in to the Drupal site process.
         * The sign in endpoint is specified by LOGIN_URL -
         * should be a Drupal sight using iForm Mobile Auth Module.
         *
         * It is important that the app authorises itself providing
         * appname and appsecret for the mentioned module.
         */
        signIn: function(){
            _log('Sign in.');

            //user logins
            var form = document.getElementById('login-form');
            var data = new FormData(form);

            //app logins
            data.append('appname', this.CONF.APPNAME);
            data.append('appsecret', this.CONF.APPSECRET);

            $.ajax({
                url : this.CONF.URL,
                type : 'POST',
                data : data,
                dataType: 'text',
                contentType: false,
                processData: false,
                timeout: this.CONF.TIMEOUT,
                success: this.onLoginSuccess,
                error: this.onLoginError,
                beforeSend: this.onLogin
            });
        },

        onLogin: function(){
            $.mobile.loading('show');
        },

        onLoginSuccess: function(data){
            _log('Sign in success.')
            $.mobile.loading('hide');
        },

        onLoginError: function(xhr, ajaxOptions, thrownError){
            _log("Sign in error "  + xhr.status+ " " + thrownError);
            _log(xhr.responseText);
            $.mobile.loading('hide');
        }

    };

}(jQuery));