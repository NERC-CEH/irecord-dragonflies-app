<div data-role="header" data-position="fixed" data-tap-toggle="false">
    <div class='ui-btn-left' data-role='controlgroup' data-type='horizontal'>
        <a href='#' data-rel='back' class="ui-btn ui-icon-carat-l ui-nodisc-icon
        ui-alt-icon ui-btn-icon-notext">Back</a>
    </div>
    <h1 id='login_heading'>Sign in</h1>
</div>

<div data-role="content">
    <form id="login-form">
        <input type="email" placeholder="Email" name="email" value="">
        <input type="password" placeholder="Password" name="password" value="">

        <input type="button" id="login-button" value="Sign in">
    </form>
    <ul data-role="listview" data-inset="true" data-theme="a" data-divider-theme="a" data-count-theme="a" data-split-theme="a" data-split-icon="carat-r">
        <li data-icon="carat-r" class="first">
            <a href="#register" data-role="button" role="button">Create new account</a>
        </li>
        <li data-icon="carat-r" class="last">
            <a href="http://www.brc.ac.uk/irecord/user/password" data-role="button" rel="external">Request new password</a>
        </li>
    </ul>
</div>
