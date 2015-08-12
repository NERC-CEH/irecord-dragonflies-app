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
            <a href="#user" class="sync sync-icon-local saved-list-item" data-id="<%- record.id %>">
                <% if (record.img) { %>
                    <div class="img-picker-display <%- record.multiRecord ? 'multi':'' %>"
                         style="background-image: none; border: 0px; height: 55px; width: 55px;">
                        <img src="<%- record.img.data %>">
                    </div>
                <% } else { %>
                    <div class="img-picker-display <%- record.multiRecord ? 'multi':'' %>"></div>
                <% } %>

                <p><strong><%- record.date %></strong></p>
                <% if (record.multiRecord) { %>
                    <p><i><%- record.multiRecord %> species</i></p>
                <% } else { %>
                    <p><i><%- record.common_name %></i></p>
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
