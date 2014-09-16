/**
 * Created by karkaz on 20/08/14.
 */
(function($){
    app.controller = app.controller || {};
    app.controller.login = {
        //controller configuration should be set up in an app config file
        CONF: {
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
        login: function(){
            _log('Sign in.');
            var form = jQuery('#login-form');
            var person = {
                //user logins
                'email': form.find('input[name=email]').val(),
                'password': form.find('input[name=password]').val(),

                //app logins
                'appname': app.auth.CONF.APPNAME,
                'appsecret': app.auth.CONF.APPSECRET
            };

            $.ajax({
                url : this.CONF.URL,
                type : 'POST',
                data : person,
                callback_data: person,
                dataType: 'text',
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
            _log('Sign in success.');

            var lines = (data && data.split(/\r\n|\r|\n/g));
            if (lines && lines.length >= 3 && lines[0].length > 0) {
                var user = {
                    'secret': lines[0],
                    'name': lines[1] + " " + lines[2],
                    'email': this.callback_data.email
                }
            }

            $.mobile.loading('hide');
            app.controller.login.setLogin(user);
            history.back();
        },

        onLoginError: function(xhr, ajaxOptions, thrownError){
            _log("Sign in error "  + xhr.status+ " " + thrownError);
            _log(xhr.responseText);
            $.mobile.loading('hide');
        },

        /**
         * Logs the user out of the system.
         */
        logout: function(){
            app.auth.removeUser();
        },

        /**
         * Sets the app login state of the user account.
         *
         * Saves the user account details into storage for permanent availability.
         * @param user User object or empty object
         */
        setLogin: function(user){
            if(!$.isEmptyObject(user)) {
                _log('Logged in');
                app.auth.setUser(user);
            } else {
                _log('Logged out');
               app.auth.removeUser();
            }
        },

        /**
         * Brings the state of the user being logged in.
         * @returns boolean true if the user is logged in, or false if not
         */
        getLoginState: function(){
            return app.auth.isUser();
        }
    };

}(jQuery));