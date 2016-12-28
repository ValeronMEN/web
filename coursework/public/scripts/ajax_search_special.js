var input_initial_value = '';

$(window).on("load",function(){
	$("#search_box").keyup(function(I){ // читаем ввод с клавиатуры
		switch(I.keyCode) {
			case 13:  // enter
			case 27:  // escape
			case 38:  // стрелка вверх
			case 40:  // стрелка вниз
			break;
			default:
				// производим поиск только при вводе более 2х символов
				if($(this).val().length>1){
          input_initial_value = $(this).val();
          var aName = $(this).val();
          var artist = "name="+aName;
          $.ajax({
            url:'/search/bytag/name',
            method:'get',
            data: artist,
            success:function(response){
              if(response.drugs != null){
                var list = response.drugs;
								if (null != list[0]){
									console.log(list[0].image);
									updateList(list);
								}
              }
            }
          });
				}
			break;
		}
	});
});

function updateList(objJSON) {
  var drugs = {
    "drugs" : objJSON
  }
  var template = document.getElementById("my-list-template").innerHTML;
  var renderedHTML = Mustache.render(template, drugs);
  console.log(renderedHTML);
  document.getElementById("template-output").innerHTML = renderedHTML;
	document.getElementById("ajaxResults").innerHTML = "Results:";
}
