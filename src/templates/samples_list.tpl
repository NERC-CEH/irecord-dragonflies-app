<% if (this.collection.length) { %>
    <div class="info-message"><p>Saved recordings.</p></div>

    <ul data-role="listview" id="samples-list"
        class="ui-nodisc-icon ui-alt-icon listview-full listview-top">
        <li>
            <a href="#user" id="syncAll-button" class="ui-icon-recycle">
                <center>Synchronize All</center>
            </a>
        </li>
    </ul>
<% } else { %>
    <div class="info-message"><p>No saved recordings.</p></div>
<% } %>
