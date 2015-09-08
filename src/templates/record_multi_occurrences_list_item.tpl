<a href="#record/multi/occurrences/<%- id %>" data-id="<%- id %>"
   class="record-multi-occurrences-list-item">
    <div class="img-picker multi">
        <input class="img-picker-file" type="file" accept="image/*" data-role="none"/>

        <% if (img) { %>
            <div class="img-picker-display" style="background-image: none; border: 0px; height: 75px; width: 75px;">
                <img src="<%- img.data %>">
            </div>
        <% } else { %>
            <div class="img-picker-display"></div>
        <% } %>

    </div>

    <% if (app.models.user.isSortScientific(true)) { %>
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
