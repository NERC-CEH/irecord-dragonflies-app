/**
 * Created by karkaz on 20/08/14.
 */
(function($){
    app.controller = app.controller || {};
    app.controller.login = {
        LOGIN_URL: conf_login_url,
        LOGIN_TIMEOUT: 20000,

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
            data.append('appname', 'dragonfly');
            data.append('appsecret', 'mydragonfly');

            $.ajax({
                url : this.LOGIN_URL,
                type : 'POST',
                data : data,
                dataType: 'text',
                contentType: false,
                processData: false,
                timeout: this.LOGIN_TIMEOUT,
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