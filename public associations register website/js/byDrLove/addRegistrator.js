$(".password2").on("keyup", function() { // Выполняем скрипт при изменении содержимого 2-го поля
  var value_input1 = $(".password1").val(); // Получаем содержимое 1-го поля
  var value_input2 = $(this).val(); // Получаем содержимое 2-го поля
  if(value_input1 != "" && value_input2 != ""){
    if(value_input1 != value_input2) { // Условие, если поля не совпадают
      $(".error").html("Паролі не співпадають!"); // Выводим сообщение
      $("#submit").attr("disabled", "disabled"); // Запрещаем отправку формы
      $(".password1").css("box-shadow", "0 0 20px #CC0000");
      $(".password2").css("box-shadow", "0 0 20px #CC0000");
    } else { // Условие, если поля совпадают
      $("#submit").removeAttr("disabled");  // Разрешаем отправку формы
      $(".error").html(""); // Скрываем сообщение
      $(".password1").css("box-shadow", "none");
      $(".password2").css("box-shadow", "none");
    }
  }
});

$(".password1").on("keyup", function() { // Выполняем скрипт при изменении содержимого 2-го поля
  var value_input1 = $(".password2").val(); // Получаем содержимое 1-го поля
  var value_input2 = $(this).val(); // Получаем содержимое 2-го поля
  if(value_input1 != "" && value_input2 != ""){
    if(value_input1 != value_input2) { // Условие, если поля не совпадают
      $(".error").html("Паролі не співпадають!"); // Выводим сообщение
      $("#submit").attr("disabled", "disabled"); // Запрещаем отправку формы
      $(".password1").css("box-shadow", "0 0 20px #CC0000");
      $(".password2").css("box-shadow", "0 0 20px #CC0000");
    } else { // Условие, если поля совпадают
      $("#submit").removeAttr("disabled");  // Разрешаем отправку формы
      $(".error").html(""); // Скрываем сообщение
      $(".password1").css("box-shadow", "none");
      $(".password2").css("box-shadow", "none");
    }
  }
});
