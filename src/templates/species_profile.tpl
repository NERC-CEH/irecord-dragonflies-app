<center>
    <img id='profile_pic' src="<%- profile_pic %>">

    <div class="gallery" id="species_gallery" style="display:none">
        <a href="<%- profile_pic %>">
            <img src="<%- profile_pic %>" alt="&copy; <%- profile_pic_author %>">
        </a>
        <% _.each( _.zip(gallery, gallery_authors), function ( pic ) { %>
        <a href="<%- pic[0] %>"><img src="<%- pic[0] %>" alt="&copy; <%- pic[1] %>"/></a>
        <% }); %>
    </div>

    <% if (!general) { %>
    <div data-role="navbar" data-iconpos="left">
        <ul>
            <li>
                <button id="species-map-button">Distribution</button>
            </li>
            <li>
                <button id="gallery-button">Gallery</button>
            </li>
        </ul>
    </div>
    <% } %>

    <ul id="species-map" data-role="listview" data-inset="true" style="max-width: 800px; display: none">
        <li >
            <div id="maps-holder" style="display:none"></div>
            <svg viewBox="0 0 400 500"  preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"
                 xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
                <use id="species-map-data" xlink:href="#data"/>
                <use id="species-map-boundary" xlink:href="#boundary"/>
            </svg>
        </li>
    </ul>

    <ul data-role="listview" data-inset="true" style="max-width:800px;">
        <li>
            <div class="common-name"><%- common_name %></div>
            <div class="taxon"><%- taxon %></div>
        </li>
        <% if (!general) { %>
        <li id="species-flight"></li>
        <% } %>
        <li>
            <p><%- description %></p>
        </li>
        <% if (distribution) { %>
        <li>
            <strong>Distribution</strong>:
            <p><%- distribution %></p>
        </li>
        <% } %>
        <% if (habitat) { %>
        <li>
            <strong>Habitat</strong>:
            <p><%- habitat %></p>
        </li>
        <% } %>
        <% if (confusion_species) { %>
        <li>
            <strong>Confusion Species</strong>:
            <p><%- confusion_species %></p>
        </li>
        <% } %>
    </ul>
    <% if (!general) { %>
    <div data-role="navbar" data-iconpos="left">
        <ul>
            <li><a href='#species-terms' data-role="button" data-icon="info" data-prefetch>Species Terms</a></li>
        </ul>
    </div>
    <% } %>
</center>




