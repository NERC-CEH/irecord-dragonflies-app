<div data-role="header" data-position="fixed" data-tap-toggle="false">
    <div class='ui-btn-left' data-role='controlgroup' data-type='horizontal'>
        <a href='#' data-rel='back' class="ui-btn ui-icon-carat-l ui-nodisc-icon
        ui-alt-icon ui-btn-icon-notext">Back</a>
    </div>
    <h1 id='about_heading'>About App</h1>
</div>

<div data-role="content">
    <ul data-role="listview">
        <li>
            <p>Dragonfly records are vital in order to accurately determine their distribution
                and numbers, and to help advise conservation for the species that need it. </p>

            <p>Any records you submit using the <i>iRecord Dragonfly</i> app will be reviewed and
                verified by an expert before being added to iRecord <a href="www.brc.ac.uk/irecord">website</a>
               and also at 1km resolution via the NBN Gateway in the Dragonfly Recording Network dataset.</p>

            <p>Thank you for taking part!</p>
        </li>
        <li>
            <div data-role="collapsibleset" data-theme="a" data-content-theme="a" data-mini="true">
                    <div data-role="collapsible">
                            <h3>Make a new record</h3>
                        <p>Please press a <b>plus</b> button next to a
                        species listing on the <a href="#list">home</a> page and when the recording page opened
                        - fill in the details, like <b>location</b>, <b>date</b>, <b>number</b> etc.
                        When finished, press a black <b>Save</b> button (top-right).</p>
                </div>
                    <div data-role="collapsible">
                            <h3>Sign in/out or register</h3>
                        <p>Go to <a href="#settings">user settings</a> page
                        (top-right of <a href="#user">user</a> page).</p>
                </div>
                    <div data-role="collapsible">
                            <h3>Last one</h3>
                        <p>Your saved records will be shown on <a href="#user">user</a> page.
                        Whether the record has been submitted to the database or not is shown through
                        a cloud icon. <em style="color:red">Red</em> icon - saved locally,
                        <em style="color:green">green</em> - synced to the database.</p>

                    <p>If you have signed in, the records will be automatically synchronised
                        to the database in the background, else you would have to manage </p>
                </div>
            </div>
        </li>
        <li>
            <strong>The British Dragonfly Society</strong>
            <p>The BDS is a social conservation organisation, supporting an ever-growing
                network of over 1,500 dragonfly professionals and volunteers, experts and enthusiasts,
                all working to survey, monitor, research and conserve dragonflies, learn more about
                them and secure their future in the British Isles.</p>
        </li>
        <li>
            <strong>Further information</strong>
            <p>For further information about the <i>iRecord Dragonfly</i> app and
                dragonfly recording, please visit the British Dragonfly Society
                <a href="http://www.british-dragonflies.org.uk/">website</a>.</p>
        </li>
    </ul>
    <ul data-role="listview" class="listview-top">
        <% if (!app.browser.isIOS()) { %>
        <li>
            <strong>How to download the app?</strong>
            <p>1. Navigate to <a href="#list">home page</a></p>
            <p>2. Find and open your <strong>Browser Options</strong></p>
            <p>3. Tap <strong>Add to Home Screen</strong> option</p>
        </li>
        <% } %>
        <li>
            <strong>App Development</strong>
            <p>This app was developed by the BRC mobile development team. For suggestions and feedback
                please do not hesitate to <a href='mailto:karkaz%40ceh.ac.uk?subject=iRecord%20Dragonflies%20Support%26Feedback&body=%0A%0A%0AVersion%3A%20<%- app.VERSION %>%0ABrowser%3A <%- window.navigator.appVersion %>%0A'>contact us</a>.</p>
        </li>
        <li>
            <p class="app-version">v<%- app.VERSION %></p>
        </li>
    </ul>
</div>