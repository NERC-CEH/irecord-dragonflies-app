<% if (records.length) { %>
    <div class="info-message"><p>Saved recordings.</p></div>

    <ul data-role="listview" id="saved-list"
        class=" ui-nodisc-icon ui-alt-icon" data-inset="true">
        <li>
            <a href="#user" id="syncAll-button" class="ui-icon-recycle">
                <center>Synchronize All</center>
            </a>
        </li>
        <% _.each (records, function (record) { %>
        <li>
            <a href="#user" class="sync-button saved-list-item" data-id="<%- record.id %>">
                <div class="camera-picker"></div>

                <p><strong><%- record.date %></strong></p>
                <% if (record.multiRecord) { %>
                    <p><i>Multi-Record:</i> <%- record.multiRecord %> species</p>
                <% } else { %>
                    <p><%- record.common_name %></p>
                <% } %>
            </a>
            <a href="#user" class="delete-button ui-icon-delete"
               data-id="<%- record.id %>">Delete</a>
        </li>
        <% }); %>
    </ul>
<% } else { %>
    <div class="info-message"><p>No saved recordings.</p></div>
<% } %>
