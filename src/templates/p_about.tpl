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
                and also shared at 1km resolution via the NBN Gateway in the Dragonfly Recording Network dataset.</p>

            <p>Thank you for taking part!</p>
        </li>
        <li style="padding-top:0; padding-bottom:0">
            <div data-role="collapsible" class="no-top-border no-top-margin"
                 data-inset="false" data-iconpos="right" data-collapsed-icon="carat-d" data-expanded-icon="carat-u">
                <h3>How to make a new record</h3>
                <p>Please press a <b>plus</b> button next to a species listing on the
                    <a href="#list">home</a> page and fill in the details of the sighting,
                    like <b>location</b>, <b>date</b>, <b>number seen</b> etc.</p>

                <p>When finished, press a black <b>Save</b> button (top-right).</p>
            </div>
            <div data-role="collapsible" class="no-top-border no-top-margin"
                 data-inset="false" data-iconpos="right" data-collapsed-icon="carat-d" data-expanded-icon="carat-u">
                <h3>How to make a multi record</h3>
                <p>Please press a <b>double plus</b> button top-right of the <a href="#list">home</a> page
                    and add your <b>location</b> and <b>date</b>. When done, press <b>Next</b>
                    button (top-right) and make a sighted species list by pressing <b>plus</b>
                    button and selecting species from the list. To change the number of species
                    seen in different stages, press on the saved species listing (below plus button)
                    and fill in the details.</p>

                <p>When finished, press a black <b>Save</b> button (top-right). You will be then asked
                whether you have recorded all the species seen.</p>
            </div>
            <div data-role="collapsible" data-inset="false" data-iconpos="right" data-collapsed-icon="carat-d" data-expanded-icon="carat-u">
                <h3>How to sign in/out or register</h3>
                <p>Go to <a href="#settings">user settings</a> page
                    (top-right of <a href="#user">user</a> page) and follow the instructions.</p>
            </div>
            <div data-role="collapsible"
                 data-inset="false" data-iconpos="right" data-collapsed-icon="carat-d" data-expanded-icon="carat-u">
                <h3>Synchronisation with iRecord</h3>
                <p>Your saved records will be shown on the <a href="#user">user</a> page.
                    If the record has reached the database the
                    <em style="color:red">red</em> cloud icon (saved locally) will become
                    <em style="color:green">green</em> (synced to the database).</p>

                <p>If you have signed in to iRecord account and there is a network connection,
                    the records will be automatically synchronised to the database
                    in the background. </p>
                <p>If you have switched the auto synchronisation off on the
                    <a href="#settings">user settings</a> page or not signed in to iRecord,
                    then by pressing a saved record with a <em style="color:red">red</em> cloud icon
                    and filling in your contact details will submit the record to the database.</p>
            </div>
            <% if (!app.browser.isIOS()) { %>
                <div data-role="collapsible" data-inset="false" data-iconpos="right" data-collapsed-icon="carat-d" data-expanded-icon="carat-u">
                    <h3>How to download the app</h3>
                    <p>This mobile application is web based, in other words - it is a
                        website made for mobile devices. This means that it is hosted
                        on BDS server and not Google Play store or similar place. To save such a
                        website as an app, you need to bookmark it to your home screen.</p>

                    <p>1. Navigate to <a href="#list">home page</a></p>
                    <p>2. Find and open your <strong>Browser Menu</strong></p>
                    <p>3. Tap <strong>Add to Home Screen</strong> option</p>
                </div>
            <% } %>
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
    <ul data-role="listview" class="space-top">
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