/**
 * Created by karkaz on 20/08/14.
 */
(function($){
    app.controller = app.controller || {};
    app.controller.settings = {
        pagecontainershow: function(){
            this.setLoginButtons();
        },

        /**
         * Shows/hides login buttons on the state of the user login
         */
        setLoginButtons: function(){
            var loggedin = app.controller.login.getLoginState();
            var loginButton = $('#login-button');
            var logoutButton = $('#logout-button');
            if(loggedin){
                loginButton.hide();
                logoutButton.show();
            } else {
                loginButton.show();
                logoutButton.hide();
            }
        },

        /**
         * Logs out the user account from the app.
         */
        logout: function(){
            app.controller.login.logout();
            this.setLoginButtons();
        }


    };
}(jQuery));