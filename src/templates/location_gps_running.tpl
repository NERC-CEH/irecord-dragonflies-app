    <div class="info-message">
        <p>We are trying to get your location. This might take a
            few minutes...</p>
    </div>
    <% if (obj.location) { %>
        <% if (obj.location.accuracy > morel.geoloc.CONF.GPS_ACCURACY_LIMIT) { %>
            <div class="warning-message">
                <p>Accuracy: <%- obj.location.accuracy %> meters (< <%- morel.geoloc.CONF.GPS_ACCURACY_LIMIT %>)</p>
            </div>
        <% } else { %>
            <div class="info-message">
                <p>Accuracy: <%- obj.location.accuracy %> meters </p>
            </div>
        <% } %>
    <% } %>

    <input type="button" id="gps-stop-button" value="Stop">
