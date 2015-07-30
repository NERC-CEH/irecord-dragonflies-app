<a href="#record/multi/occurrences/<%- id %>" data-id="<%- id %>" class="record-multi-occurrences-list-item">

    <div class="camera-picker"></div>
    <!--img class="multi-record-recorded-species-img" src="images/unknown.png" /-->

    <% if (app.models.user.isSortScientific()) { %>
        <p class="species-list-main-name"><b><i><%- taxon %></i></b></p>
        <p class="species-list-secondary-name"><%- common_name %></p>
        <p class="species-list-results">
            <% for (stage in stages) { %>
            <% if (stages[stage]) { %>
            <b><%- stage %>: </b> <%- stages[stage] %>
            <% } %>
            <% } %>
        </p>
    <% } else { %>
        <p class="species-list-main-name"><b><%- common_name %></b></p>
        <p class="species-list-secondary-name"><i><%- taxon %></i></p>
        <p class="species-list-results">
            <% for (stage in stages) { %>
                <% if (stages[stage]) { %>
                    <b><%- stage %>: </b> <%- stages[stage] %>
                <% } %>
            <% } %>
        </p>
    <% } %>
</a>
<a class="record-multi-occurrences-remove" data-id="<%- id %>" data-icon="minus">Remove</a>
