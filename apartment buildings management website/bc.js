<% layout('profile/layout') -%>
<script>
$(document).ready(function(){
  $("#categoryUser").on("change",function(){
    var pcz = $(this).val();
    if($(this).val() == "test1"){
      var companyName = $("#companyName").val();
      var lastname = $("#lastname").val();
      var firstname = $("#firstname").val();
      var patronymic = $("#patronymic").val();
      var city = $("#city").val();
      var street = $("#street").val();
      var housenumber = $("#housenumber").val();
      var email = $("#email").val();
      $("templatehere").append("<p id='up'> "+companyName+"<br />\
   "+lastname+" "+firstname+" "+patronymic+"<br />\
  "+city+",   "+street+", "+housenumber+"<br />\
  "+email+"<br /><br /><br />\
                                     Заява<br />\
                 про вчинення адміністративного правопорушення<br />\
   за статтею 7.22 КоАП Порушення правил утримання та ремонту житлових будинків<br />\
   За адресою "+street+","+housenumber+"керуюча організація<br />\
   порушує норми Житлового кодексу України та Правила надання комунальних послуг,<br />\
   а саме: </p>\
   <input type='text' name='place' id='place' placeholder='де?'>: <input type='text' name='subject' id='subject' placeholder='що?'><br />\
   <input type='text' name='description' id='description' placeholder='короткий опис проблеми'><br />\
   <p id='down'>Згідно з Санітарно-епідеміологічними вимогами до умов проживання в житлових<br />\
   будівлях і приміщеннях (Державні санітарні норми 2.1.2.2645-10) системи<br />\
   опалення та вентиляції повинні забезпечувати допустимі умови мікроклімату<br />\
   і повітряного середовища приміщень. </p>\

   <button class='btn btn-outline-success my-2 my-sm-0' type='submit' >Search</button>\
     <div id='regInsideContent'>\
       <div class='regField'>\
         <input required type='hidden' value='Заява про вчинення адміністративного правопорушення' name='title'>\
       </div>\
       <div class='regField'>\
         <input id='textValue' required type='hidden' value='' name='text'>\
       </div>\
       <div class='regField'>\
         <input required type='hidden' value='"+id+"' name='category'>\
       </div>\
     </div>\
     <input type='hidden' name='_csrf' value='<%=csrfToken%>'>\
")
    }
});
});
});
</script>
<div class="row">
  <input type="hidden" id="companyName" value="<%= companyName %>">
  <input type="hidden" id="lastname" value="<%= user.lastname %>">
  <input type="hidden" id="firstname" value="<%= user.firstname %>">
  <input type="hidden" id="patronymic" value="<%= user.patronymic %>">
  <input type="hidden" id="city" value="<%= network.city %>">
  <input type="hidden" id="street" value="<%= network.street %>">
  <input type="hidden" id="housenumber" value="<%= network.housenumber %>">
  <input type="hidden" id="email" value="<%= user.email %>">
  <button data-remodal-action="close" class="remodal-close"></button>
  <header class="major my-form-header">
    <h2>Send a new request</h2>
  </header>
  <form method="post" action="/profile/create_request" id="userRequestForm">
    <input type="hidden" name="_csrf" value='<%=csrfToken%>'>
    <div class="row uniform 100%">
      <div class="6u$ network-create-form userCategoryWrapper">
        <label class="my-label" for="category">Select a category</label>
        <div class="select-wrapper userSelectWrapper">
                    <select name="category" id="categoryUser">
                        <option selected isabled value style="display:none">Category</option>
                        <% if(categories) {%>
                          <% for (let i = categories.length-1; i >= 0; i--) {  %>
                            <option  value="<%= categories[i].name %>"><%= categories[i].name %></option>
                            <% } %>
                          <%}
                        %>

                    </select>
        </div>
      </div>
                  <div class="12u$ network-create-form">
                    <label class="my-label" for="title">Title</label>
                    <input class="my-text-inputs" type="text" name="title" id="title" value="" placeholder="New Password">
                  </div>
                  <div class="12u$ network-create-form templatehere">
                    <label class="my-label" for="text">Request's message</label>
                    <!--  <input class="my-text-inputs"type="textarea" name="text" id="text" value="" placeholder="Request message">-->
                  </div>
                  <div class="12u$">
                      <button class="button special fit my-btn request-btn">Send</button>
                  </div>
    </div>
  </form>
  <!--<button data-remodal-action="cancel" class="remodal-cancel">Cancel</button>
  <button data-remodal-action="confirm" class="remodal-confirm">OK</button>-->

</div>
