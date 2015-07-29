<% if (records.length) { %>
    <div class="info-message"><p>Saved recordings.</p></div>

    <ul data-role="listview" id="saved-list" data-split-icon="gear"
        data-inset="true" data-split-theme="d">
        <li data-corners="false" data-shadow="false" data-iconshadow="true"
            data-wrapperels="div" data-icon="arrow-r" data-iconpos="right"
            data-theme="b">
            <a href="#user" id="syncAll-button" data-role="button">
                <center>Synchronize All</center>
            </a>
        </li>
        <% _.each (records, function (record) { %>
        <li data-corners="false" data-shadow="false" data-iconshadow="true"
            data-wrapperels="div" data-icon="arrow-r" data-iconpos="right">
            <a href="#user" class="sync-button" data-id="<%- record.id %>">
                <p><strong><%- record.date %></strong></p>
                <% if (record.multiRecord) { %>
                    <p><i>Multi-Record:</i> <%- record.multiRecord %> species</p>
                <% } else { %>
                    <p><%- record.common_name %></p>
                <% } %>
            </a>
            <a href="#user" class="delete-button" data-icon="delete" data-ajax="false"
               data-id="<%- record.id %>">Delete</a>
        </li>
        <% }); %>
    </ul>
<% } else { %>
    <div class="info-message"><p>No saved recordings.</p></div>
<% } %>
