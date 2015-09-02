<ul data-role="listview" class="record-info space-top no-top-border">
    <li>
        <strong>Date</strong>
        <div class="info"><%- obj.date %></div>
    </li>
    <li>
        <strong>Location</strong>
        <div class="info"><%- obj.latitude %>, <%- obj.longitude %></div>
    </li>
    <% if (obj.recorded_all === false || obj.recorded_all === true) { %>
        <li>
            <strong>Recorded All</strong>
            <div class="info"><%- obj.recorded_all %></div>
        </li>
    <% } %>
    <% if (obj.comment) { %>
    <li>
        <p><%- obj.comment %></p>
    </li>
    <% } %>
</ul>
<ul data-role="listview" class="no-top-border">
    <% _.each(obj.occurrences, function (occurrence) { %>
        <li>
            <div class="img-picker multi">
                <% if (occurrence.img) { %>
                <div class="img-picker-display" style="background-image: none; border: 0px; height: 75px; width: 75px;">
                    <img src="<%- occurrence.img.data %>">
                </div>
                <% } else { %>
                <div class="img-picker-display"></div>
                <% } %>

            </div>
            <p style="margin-left: 85px;">
                <b><%- occurrence.common_name %></b> <br/>
                <i><%- occurrence.taxon %></i><br/><br/>

                <% if (occurrence.number) { %>
                    <strong>Number:</strong> <%- occurrence.number %> <br/>
                <% } %>

                <% if (occurrence.stage) { %>
                    <strong>Stage:</strong> <%- occurrence.stage %> <br/>
                <% } %>

                <% if (occurrence.adult) { %>
                <strong>Ad:</strong> <%- occurrence.adult %>
                <% } %>

                <% if (occurrence.copulating) { %>
                <strong>Ad:</strong> <%- occurrence.adult %>
                <% } %>

                <% if (occurrence.ovipositing) { %>
                <strong>Ov:</strong> <%- occurrence.ovipositing %>
                <% } %>

                <% if (occurrence.larvae) { %>
                <strong>La:</strong> <%- occurrence.larvae %>
                <% } %>

                <% if (occurrence.exuviae) { %>
                <strong>Ex:</strong> <%- occurrence.exuviae %>
                <% } %>

                <% if (occurrence.emergent) { %>
                <strong>Em:</strong> <%- occurrence.emergent %>
                <% } %>

                <% if (occurrence.comment) { %>
                    <br/> <p><%- occurrence.comment %>
                <% } %>
            </p>
        </li>
    <% }) %>
</ul>