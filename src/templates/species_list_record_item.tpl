<a href="#multi-record" class="<%- favourite ? 'favourite': '' %>">
    <img class="multi-record-species-img" src="<%- profile_pic %>" data-id="<%- id %>"/>
    <div class="species-info-icon"></div>
    <% if (app.models.user.isSortScientific()) { %>
      <p class="species-list-main-name"><i><%- taxon %></i></p>
      <p class="species-list-secondary-name"><%- common_name %></p>
    <% } else { %>
      <p class="species-list-main-name"><%- common_name %></p>
      <p class="species-list-secondary-name"><i><%- taxon %></i></p>
    <% } %>
</a>
<a href="#multi-record-species/<%- id %>" data-icon="edit">Species</a>
