<div data-role="header" data-position="fixed" data-tap-toggle="false">
    <div class='ui-btn-left' data-role='controlgroup' data-type='horizontal'>
        <a href='#' data-rel='back' class="ui-btn ui-icon-carat-l ui-nodisc-icon
        ui-alt-icon ui-btn-icon-notext">Back</a>
    </div>
    <h1 id='login_heading'>Sign in</h1>
</div>

<div data-role="content">
    <input type="email" placeholder="Email" name="email" value="">
    <input type="password" placeholder="Password" name="password" value="">

    <button id="login-button"
            class="ui-nodisc-icon ui-alt-icon ui-btn ui-icon-carat-r ui-btn-icon-right">Sign in</button>

    <ul data-role="listview" class="listview-top" data-split-icon="carat-r">
        <li data-icon="carat-r" class="first">
            <a href="#register"
               class="ui-nodisc-icon ui-alt-icon ui-btn ui-icon-plus ui-btn-icon-right">Create new account</a>
        </li>
        <li data-icon="carat-r" class="last">
            <a href="http://www.brc.ac.uk/irecord/user/password"
               class="ui-nodisc-icon ui-alt-icon ui-btn ui-icon-edit ui-btn-icon-right"
               rel="external">Request new password</a>
        </li>
    </ul>
</div>
