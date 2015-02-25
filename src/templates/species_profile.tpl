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

    <% if (map) { %>
        <button id="species-map-button">Show Distribution</button>

        <svg viewBox="0 0 400 500" id="species-map" preserveAspectRatio="none" style="display:none" xmlns="http://www.w3.org/2000/svg"
             xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
            <use id="species-map-data" xlink:href="<%- map %>#data"/>
            <use id="species-map-boundary" xlink:href="images/national_boundary.svg#boundary"/>
        </svg>
    <% } %>

    <ul data-role="listview" data-inset="true" style="max-width:800px;">

        <li>
            <div class="common-name"><%- common_name %></div>
            <div class="taxon"><%- taxon %></div>
        </li>
        <li id="species-flight"></li>
        <li>
            <p><%- description %></p>
        </li>
        <li><strong>Distribution</strong>:
            <p><%- distribution %></p></li>
        <li><strong>Habitat</strong>:
            <p><%- habitat %></p></li>
    </ul>
</center>




