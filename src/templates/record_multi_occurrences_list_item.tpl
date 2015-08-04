<a href="#record/multi/occurrences/<%- id %>" data-id="<%- id %>"
   class="record-multi-occurrences-list-item">
    <div class="camera-picker"></div>

    <% if (app.models.user.isSortScientific()) { %>
        <p class="species-list-main-name"><b><i><%- taxon %></i></b></p>
    <% } else { %>
        <p class="species-list-main-name"><b><%- common_name %></b></p>
    <% } %>

    <p class="species-list-results">
        <% for (stage in stages) { %>
            <% if (stages[stage]) { %>
                <b><%- stage %>: </b> <%- stages[stage] %>
            <% } %>
        <% } %>
        <% if (comment) { %>
            <br/><i><%- comment %></i>
        <% } %>
    </p>
</a>
<a class="record-multi-occurrences-remove ui-icon-delete ui-nodisc-icon ui-alt-icon"
   data-id="<%- id %>">Remove</a>
