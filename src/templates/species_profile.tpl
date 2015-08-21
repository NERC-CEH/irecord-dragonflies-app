<center>
    <img id='profile_pic' src="<%- profile_pic %>">

    <div class="gallery" id="species_gallery" style="display:none">
        <a href="<%- profile_pic %>">
            <img src="<%- profile_pic %>" alt="<%- profile_pic_sex %> &nbsp&nbsp &copy; <%- profile_pic_author %>">
        </a>
        <% _.each( _.zip(gallery, gallery_authors, gallery_sex), function ( pic ) { %>
        <a href="<%- pic[0] %>"><img src="<%- pic[0] %>" alt="<%- pic[2] %> &nbsp&nbsp &copy; <%- pic[1] %>"/></a>
        <% }); %>
    </div>

    <% if (!general) { %>
    <div data-role="navbar" data-iconpos="left">
        <ul>
            <li style="border-right: 1px solid #dddddd;">
                <button id="gallery-button"
                        class="ui-btn ui-alt-icon ui-nodisc-icon ui-icon-eye ui-btn-icon-right">Gallery</button>
            </li>
            <li>
                <button id="species-map-button"
                        class="ui-btn ui-alt-icon ui-nodisc-icon ui-icon-location ui-btn-icon-right">Distribution</button>
            </li>
        </ul>
    </div>
    <% } %>

    <ul data-role="listview">
        <li style="border-top: none;">
            <div class="common-name"><%- common_name %></div>
            <div class="taxon"><%- taxon %></div>
        </li>
        <li id="species-map" style="display: none">
            <div id="maps-holder" style="display:none"></div>
            <svg viewBox="0 0 400 500"  preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"
                 xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
                <use id="species-map-data" xlink:href="#data"/>
                <use id="species-map-boundary" xlink:href="#boundary"/>
                <g id="legend">
                    <text dy="15" x="30" y="0" style="font-size: normal">Main area</text>
                    <rect width="20" height="20" fill="#C2B855" y="0" x="0"></rect>
                </g>
            </svg>
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
        <li>
            <a href="#record/<%- id %>" class="ui-btn ui-mini ui-icon-plus ui-nodisc-icon
            ui-alt-icon ui-btn-icon-right">Record Species</a>
        </li>
        <% if (!general) { %>
        <li>
            <a href='#species-terms' class="ui-btn ui-mini ui-icon-info
                ui-alt-icon ui-nodisc-icon ui-btn-icon-right">Species Terms</a>
        </li>
        <% } %>
      <% } %>
    </ul>
</center>




